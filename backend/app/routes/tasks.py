from datetime import datetime

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import Application, TaskSubmission, Student, Certificate
from app.models.task import TASK_CATALOG
from app.utils.decorators import student_required
from app.utils.certificate_generator import generate_certificate_pdf
from app.utils.email import send_certificate_ready_email

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


def _get_owned_application(application_id, student_id):
    return Application.query.filter_by(application_id=application_id, student_id=student_id).first()


@tasks_bp.route("/<string:application_id>", methods=["GET"])
@student_required
def list_tasks(application_id):
    student_id = int(get_jwt_identity())
    application = _get_owned_application(application_id, student_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404

    catalog = {t["task_number"]: t for t in TASK_CATALOG.get(application.domain, [])}
    submissions = TaskSubmission.query.filter_by(application_id=application.id).order_by(TaskSubmission.task_number).all()

    tasks = []
    for s in submissions:
        meta = catalog.get(s.task_number, {})
        task_data = s.to_dict()
        task_data["description"] = meta.get("description")
        task_data["tutorial_url"] = meta.get("tutorial_url")
        task_data["dataset_url"] = meta.get("dataset_url")
        tasks.append(task_data)

    return jsonify({"domain": application.domain, "tasks": tasks})


@tasks_bp.route("/<string:application_id>/<int:task_number>/submit", methods=["POST"])
@student_required
def submit_task(application_id, task_number):
    student_id = int(get_jwt_identity())
    application = _get_owned_application(application_id, student_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404
    if application.status != "active":
        return jsonify({"error": "Internship is not active"}), 400

    submission = TaskSubmission.query.filter_by(application_id=application.id, task_number=task_number).first()
    if not submission:
        return jsonify({"error": "Task not found"}), 404
    if submission.status == "approved":
        return jsonify({"error": "This task has already been approved"}), 400

    data = request.get_json(force=True, silent=True) or {}
    if not data.get("github_url") and application.domain == "web_development":
        return jsonify({"error": "GitHub URL is required"}), 400

    submission.github_url = data.get("github_url") or submission.github_url
    submission.live_url = data.get("live_url") or submission.live_url
    submission.report_url = data.get("report_url") or submission.report_url
    submission.status = "pending"
    submission.feedback = None
    submission.submitted_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"task": submission.to_dict()})


@tasks_bp.route("/<string:application_id>/certificate", methods=["POST"])
@student_required
def generate_certificate(application_id):
    """
    Called by the frontend once all 5 tasks show 'approved'. Idempotent:
    if a certificate already exists it's simply returned.
    """
    student_id = int(get_jwt_identity())
    application = _get_owned_application(application_id, student_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404

    if application.certificate:
        return jsonify({"certificate": application.certificate.to_dict()})

    submissions = TaskSubmission.query.filter_by(application_id=application.id).all()
    if not submissions or any(s.status != "approved" for s in submissions):
        return jsonify({"error": "All tasks must be approved before a certificate can be issued"}), 400

    student = Student.query.get(student_id)

    certificate = Certificate(application_id=application.id)
    db.session.add(certificate)
    db.session.flush()  # get certificate_number without a full commit

    pdf_url, qr_url, verification_url = generate_certificate_pdf(certificate, application, student)
    certificate.pdf_url = pdf_url
    certificate.qr_code_url = qr_url
    certificate.verification_url = verification_url
    application.status = "completed"

    db.session.commit()

    send_certificate_ready_email(student, certificate)

    return jsonify({"certificate": certificate.to_dict()}), 201
