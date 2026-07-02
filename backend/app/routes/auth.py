import secrets
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, get_jwt
)
from email_validator import validate_email, EmailNotValidError

from app.extensions import db, limiter
from app.models import Student, Admin
from app.utils.email import send_welcome_email, send_password_reset_email

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _validate_required(data, fields):
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return f"Missing required fields: {', '.join(missing)}"
    return None


# ---------------------------------------------------------------- STUDENT --

@auth_bp.route("/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    data = request.get_json(force=True, silent=True) or {}
    error = _validate_required(data, ["full_name", "email", "phone", "password"])
    if error:
        return jsonify({"error": error}), 400

    try:
        validate_email(data["email"])
    except EmailNotValidError:
        return jsonify({"error": "Invalid email address"}), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    if Student.query.filter_by(email=data["email"].lower().strip()).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    student = Student(
        full_name=data["full_name"].strip(),
        email=data["email"].lower().strip(),
        phone=data["phone"].strip(),
        college=data.get("college", "").strip() or None,
        course=data.get("course", "").strip() or None,
        graduation_year=data.get("graduation_year"),
    )
    student.set_password(data["password"])
    db.session.add(student)
    db.session.commit()

    send_welcome_email(student)

    access_token = create_access_token(identity=str(student.id), additional_claims={"role": "student"})
    refresh_token = create_refresh_token(identity=str(student.id), additional_claims={"role": "student"})

    return jsonify({
        "message": "Registration successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "student": student.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("20 per hour")
def login():
    data = request.get_json(force=True, silent=True) or {}
    error = _validate_required(data, ["email", "password"])
    if error:
        return jsonify({"error": error}), 400

    student = Student.query.filter_by(email=data["email"].lower().strip()).first()
    if not student or not student.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    if not student.is_active:
        return jsonify({"error": "This account has been deactivated"}), 403

    access_token = create_access_token(identity=str(student.id), additional_claims={"role": "student"})
    refresh_token = create_refresh_token(identity=str(student.id), additional_claims={"role": "student"})

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "student": student.to_dict(),
    })


@auth_bp.route("/forgot-password", methods=["POST"])
@limiter.limit("5 per hour")
def forgot_password():
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").lower().strip()
    student = Student.query.filter_by(email=email).first()

    # Always return 200 to avoid leaking which emails are registered
    if student:
        token = secrets.token_urlsafe(32)
        student.reset_token = token
        student.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()

        reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"
        send_password_reset_email(student, reset_url)

    return jsonify({"message": "If that email is registered, a reset link has been sent."})


@auth_bp.route("/reset-password", methods=["POST"])
@limiter.limit("10 per hour")
def reset_password():
    data = request.get_json(force=True, silent=True) or {}
    error = _validate_required(data, ["token", "password"])
    if error:
        return jsonify({"error": error}), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    student = Student.query.filter_by(reset_token=data["token"]).first()
    if not student or not student.reset_token_expires or student.reset_token_expires < datetime.utcnow():
        return jsonify({"error": "This reset link is invalid or has expired"}), 400

    student.set_password(data["password"])
    student.reset_token = None
    student.reset_token_expires = None
    db.session.commit()

    return jsonify({"message": "Password reset successful. You can now log in."})


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()
    access_token = create_access_token(identity=identity, additional_claims={"role": claims.get("role")})
    return jsonify({"access_token": access_token})


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    claims = get_jwt()
    identity = get_jwt_identity()
    if claims.get("role") == "student":
        student = Student.query.get_or_404(int(identity))
        return jsonify({"role": "student", "user": student.to_dict()})
    admin = Admin.query.get_or_404(int(identity))
    return jsonify({"role": admin.role, "user": admin.to_dict()})


# ------------------------------------------------------------------ ADMIN --

@auth_bp.route("/admin/login", methods=["POST"])
@limiter.limit("10 per hour")
def admin_login():
    data = request.get_json(force=True, silent=True) or {}
    error = _validate_required(data, ["email", "password"])
    if error:
        return jsonify({"error": error}), 400

    admin = Admin.query.filter_by(email=data["email"].lower().strip()).first()
    if not admin or not admin.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(admin.id), additional_claims={"role": admin.role})
    refresh_token = create_refresh_token(identity=str(admin.id), additional_claims={"role": admin.role})

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "admin": admin.to_dict(),
    })
