from flask import Blueprint, request, jsonify

from app.models import Certificate, Application, Student

certificates_bp = Blueprint("certificates", __name__, url_prefix="/api/certificates")


@certificates_bp.route("/verify", methods=["GET"])
def verify_certificate():
    """
    Public endpoint (no auth). Search by certificate_number or student name.
    """
    certificate_id = request.args.get("certificate_id", "").strip()
    student_name = request.args.get("student_name", "").strip()

    if not certificate_id and not student_name:
        return jsonify({"error": "Provide certificate_id or student_name"}), 400

    query = Certificate.query.join(Application).join(Student)

    if certificate_id:
        query = query.filter(Certificate.certificate_number.ilike(f"%{certificate_id}%"))
    if student_name:
        query = query.filter(Student.full_name.ilike(f"%{student_name}%"))

    results = query.limit(20).all()
    if not results:
        return jsonify({"results": [], "message": "No matching certificate found"}), 404

    payload = []
    for cert in results:
        application = cert.application
        student = application.student
        payload.append({
            "certificate_number": cert.certificate_number,
            "student_name": student.full_name,
            "domain": application.domain,
            "completion_date": cert.issued_at.isoformat() if cert.issued_at else None,
            "status": cert.status,
            "pdf_url": cert.pdf_url,
        })

    return jsonify({"results": payload})
