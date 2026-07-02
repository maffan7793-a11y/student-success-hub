from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import Student, Application, TaskSubmission
from app.utils.decorators import student_required
from app.utils.qrcode_gen import generate_qr_code

students_bp = Blueprint("students", __name__, url_prefix="/api/students")


@students_bp.route("/me/profile", methods=["GET"])
@student_required
def get_profile():
    student = Student.query.get_or_404(int(get_jwt_identity()))
    return jsonify({"student": student.to_dict()})


@students_bp.route("/me/profile", methods=["PUT"])
@student_required
def update_profile():
    student = Student.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json(force=True, silent=True) or {}

    editable_fields = ["college", "github_url", "linkedin_url", "resume_url", "profile_photo_url"]
    for field in editable_fields:
        if field in data:
            setattr(student, field, data[field])

    if "skills" in data:
        skills = data["skills"]
        student.skills = ",".join(skills) if isinstance(skills, list) else skills

    db.session.commit()
    return jsonify({"student": student.to_dict()})


@students_bp.route("/me/overview", methods=["GET"])
@student_required
def dashboard_overview():
    """Aggregated stats for the dashboard 'Overview' cards."""
    student_id = int(get_jwt_identity())
    application = Application.query.filter_by(student_id=student_id).filter(
        Application.status.in_(["active", "completed"])
    ).order_by(Application.created_at.desc()).first()

    if not application:
        return jsonify({"has_active_internship": False})

    tasks = TaskSubmission.query.filter_by(application_id=application.id).all()
    completed = sum(1 for t in tasks if t.status == "approved")
    pending = sum(1 for t in tasks if t.status == "pending")

    return jsonify({
        "has_active_internship": True,
        "application": application.to_dict(),
        "days_left": application.days_left(),
        "completed_tasks": completed,
        "pending_tasks": pending,
        "total_tasks": len(tasks),
        "progress_percent": round((completed / len(tasks)) * 100) if tasks else 0,
        "has_certificate": application.certificate is not None,
    })


@students_bp.route("/me/digital-id/<string:application_id>", methods=["GET"])
@student_required
def digital_id(application_id):
    student_id = int(get_jwt_identity())
    application = Application.query.filter_by(application_id=application_id, student_id=student_id).first_or_404()
    student = Student.query.get(student_id)

    if not application.qr_code_url:
        qr_filename = f"id-{application.digital_id}.png"
        application.qr_code_url = generate_qr_code(application.digital_id, qr_filename)
        db.session.commit()

    return jsonify({
        "student_name": student.full_name,
        "photo_url": student.profile_photo_url,
        "domain": application.domain,
        "unique_id": application.digital_id,
        "status": application.status,
        "joined_date": application.joined_date.isoformat() if application.joined_date else None,
        "expiry_date": application.expiry_date.isoformat() if application.expiry_date else None,
        "qr_code_url": application.qr_code_url,
    })
