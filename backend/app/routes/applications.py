from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import Application, Student
from app.models.application import DOMAIN_CHOICES
from app.utils.decorators import student_required

applications_bp = Blueprint("applications", __name__, url_prefix="/api/applications")


@applications_bp.route("", methods=["POST"])
@student_required
def create_application():
    """
    Step 1 + 2 of the multi-step apply flow: capture student info updates
    and the chosen domain. Creates an Application in `pending_payment`
    status; it becomes `active` once payment is verified (see payments.py).
    """
    student_id = int(get_jwt_identity())
    student = Student.query.get_or_404(student_id)

    data = request.get_json(force=True, silent=True) or {}
    domain = data.get("domain")
    if domain not in DOMAIN_CHOICES:
        return jsonify({"error": "domain must be 'web_development' or 'data_analytics'"}), 400

    existing = Application.query.filter_by(student_id=student.id, status="active").first()
    if existing:
        return jsonify({"error": "You already have an active internship application", "application": existing.to_dict()}), 409

    # Update optional profile fields collected in step 1
    for field in ("college", "course"):
        if data.get(field):
            setattr(student, field, data[field])
    if data.get("graduation_year"):
        student.graduation_year = data["graduation_year"]

    application = Application(student_id=student.id, domain=domain, status="pending_payment")
    db.session.add(application)
    db.session.commit()

    return jsonify({"application": application.to_dict()}), 201


@applications_bp.route("", methods=["GET"])
@student_required
def list_my_applications():
    student_id = int(get_jwt_identity())
    apps = Application.query.filter_by(student_id=student_id).order_by(Application.created_at.desc()).all()
    return jsonify({"applications": [a.to_dict() for a in apps]})


@applications_bp.route("/<string:application_id>", methods=["GET"])
@student_required
def get_application(application_id):
    student_id = int(get_jwt_identity())
    app_obj = Application.query.filter_by(application_id=application_id, student_id=student_id).first_or_404()
    return jsonify({"application": app_obj.to_dict()})
