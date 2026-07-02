from datetime import datetime

from flask import Blueprint, request, jsonify
from sqlalchemy import func

from app.extensions import db
from app.models import Student, Application, Payment, TaskSubmission, Certificate
from app.utils.decorators import admin_required
from app.utils.email import send_task_approval_email, send_certificate_ready_email
from app.utils.certificate_generator import generate_certificate_pdf

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# --------------------------------------------------------------- DASHBOARD --

@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard_stats():
    total_students = Student.query.count()
    total_applications = Application.query.count()
    active_internships = Application.query.filter_by(status="active").count()
    completed_internships = Application.query.filter_by(status="completed").count()
    pending_reviews = TaskSubmission.query.filter_by(status="pending").count()
    certificates_issued = Certificate.query.count()

    revenue_paise = db.session.query(func.coalesce(func.sum(Payment.amount_paise), 0)).filter(
        Payment.status == "paid"
    ).scalar()

    return jsonify({
        "total_students": total_students,
        "total_applications": total_applications,
        "active_internships": active_internships,
        "completed_internships": completed_internships,
        "pending_reviews": pending_reviews,
        "certificates_issued": certificates_issued,
        "revenue_rupees": revenue_paise / 100,
    })


# --------------------------------------------------------------- STUDENTS --

@admin_bp.route("/students", methods=["GET"])
@admin_required
def list_students():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    search = request.args.get("search", "").strip()

    query = Student.query
    if search:
        query = query.filter(
            (Student.full_name.ilike(f"%{search}%")) | (Student.email.ilike(f"%{search}%"))
        )

    pagination = query.order_by(Student.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "students": [s.to_dict() for s in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages,
    })


@admin_bp.route("/students/<int:student_id>/deactivate", methods=["POST"])
@admin_required
def deactivate_student(student_id):
    student = Student.query.get_or_404(student_id)
    student.is_active = False
    db.session.commit()
    return jsonify({"student": student.to_dict()})


# ----------------------------------------------------------- APPLICATIONS --

@admin_bp.route("/applications", methods=["GET"])
@admin_required
def list_applications():
    status = request.args.get("status")
    domain = request.args.get("domain")

    query = Application.query
    if status:
        query = query.filter_by(status=status)
    if domain:
        query = query.filter_by(domain=domain)

    apps = query.order_by(Application.created_at.desc()).all()
    payload = []
    for a in apps:
        d = a.to_dict()
        d["student"] = {"full_name": a.student.full_name, "email": a.student.email}
        payload.append(d)
    return jsonify({"applications": payload})


# ------------------------------------------------------------------- TASKS --

@admin_bp.route("/tasks/pending", methods=["GET"])
@admin_required
def pending_tasks():
    subs = TaskSubmission.query.filter_by(status="pending").order_by(TaskSubmission.submitted_at).all()
    payload = []
    for s in subs:
        d = s.to_dict()
        application = s.application
        d["application_id"] = application.application_id
        d["domain"] = application.domain
        d["student_name"] = application.student.full_name
        d["student_email"] = application.student.email
        payload.append(d)
    return jsonify({"tasks": payload})


@admin_bp.route("/tasks/<int:submission_id>/review", methods=["POST"])
@admin_required
def review_task(submission_id):
    data = request.get_json(force=True, silent=True) or {}
    decision = data.get("decision")  # "approved" | "rejected"
    if decision not in ("approved", "rejected"):
        return jsonify({"error": "decision must be 'approved' or 'rejected'"}), 400

    submission = TaskSubmission.query.get_or_404(submission_id)
    submission.status = decision
    submission.feedback = data.get("feedback")
    submission.reviewed_at = datetime.utcnow()
    db.session.commit()

    student = submission.application.student
    send_task_approval_email(student, submission, approved=(decision == "approved"))

    return jsonify({"task": submission.to_dict()})


# ------------------------------------------------------------- CERTIFICATES --

@admin_bp.route("/certificates", methods=["GET"])
@admin_required
def list_certificates():
    certs = Certificate.query.order_by(Certificate.issued_at.desc()).all()
    payload = []
    for c in certs:
        d = c.to_dict()
        d["student_name"] = c.application.student.full_name
        d["domain"] = c.application.domain
        payload.append(d)
    return jsonify({"certificates": payload})


@admin_bp.route("/certificates/<string:application_id>/generate", methods=["POST"])
@admin_required
def admin_generate_certificate(application_id):
    """Manual override: admin can force-issue a certificate."""
    application = Application.query.filter_by(application_id=application_id).first_or_404()
    if application.certificate:
        return jsonify({"error": "Certificate already issued"}), 409

    student = application.student
    certificate = Certificate(application_id=application.id)
    db.session.add(certificate)
    db.session.flush()

    pdf_url, qr_url, verification_url = generate_certificate_pdf(certificate, application, student)
    certificate.pdf_url = pdf_url
    certificate.qr_code_url = qr_url
    certificate.verification_url = verification_url
    application.status = "completed"
    db.session.commit()

    send_certificate_ready_email(student, certificate)
    return jsonify({"certificate": certificate.to_dict()}), 201


# ------------------------------------------------------------------ PAYMENTS --

@admin_bp.route("/payments", methods=["GET"])
@admin_required
def list_payments():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    payload = []
    for p in payments:
        d = p.to_dict()
        d["student_name"] = p.application.student.full_name
        d["application_id"] = p.application.application_id
        payload.append(d)
    return jsonify({"payments": payload})
