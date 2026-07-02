import os
from datetime import datetime
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from flask import current_app

from app.utils.qrcode_gen import generate_qr_code

DOMAIN_LABELS = {
    "web_development": "Web Development",
    "data_analytics": "Data Analytics",
}

NAVY = HexColor("#1e1b4b")
PURPLE = HexColor("#7c3aed")
BLUE = HexColor("#2563eb")
GOLD = HexColor("#d4af37")


def generate_certificate_pdf(certificate, application, student) -> str:
    """
    Renders a certificate PDF to CERTIFICATE_FOLDER and returns a relative URL.
    """
    folder = current_app.config["CERTIFICATE_FOLDER"]
    os.makedirs(folder, exist_ok=True)

    filename = f"{certificate.certificate_number}.pdf"
    filepath = os.path.join(folder, filename)

    verification_url = f"{current_app.config['FRONTEND_URL']}/verify-certificate?id={certificate.certificate_number}"
    qr_filename = f"{certificate.certificate_number}-qr.png"
    qr_path_relative = generate_qr_code(verification_url, qr_filename)
    qr_abs_path = os.path.join(current_app.config["UPLOAD_FOLDER"], "qrcodes", qr_filename)

    page_size = landscape(A4)
    c = canvas.Canvas(filepath, pagesize=page_size)
    width, height = page_size

    # Background
    c.setFillColor(HexColor("#f8f7ff"))
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Border
    c.setStrokeColor(PURPLE)
    c.setLineWidth(3)
    c.rect(15 * mm, 15 * mm, width - 30 * mm, height - 30 * mm, fill=0, stroke=1)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.rect(18 * mm, 18 * mm, width - 36 * mm, height - 36 * mm, fill=0, stroke=1)

    # Header
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 45 * mm, "STUDENT SUCCESS HUB")
    c.setFont("Helvetica", 13)
    c.setFillColor(PURPLE)
    c.drawCentredString(width / 2, height - 53 * mm, "Internship Portal")

    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(BLUE)
    c.drawCentredString(width / 2, height - 68 * mm, "Certificate of Completion")

    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#333333"))
    c.drawCentredString(width / 2, height - 82 * mm, "This is to certify that")

    c.setFont("Helvetica-Bold", 26)
    c.setFillColor(NAVY)
    c.drawCentredString(width / 2, height - 95 * mm, student.full_name)

    domain_label = DOMAIN_LABELS.get(application.domain, application.domain)
    c.setFont("Helvetica", 13)
    c.setFillColor(HexColor("#333333"))
    c.drawCentredString(
        width / 2, height - 108 * mm,
        f"has successfully completed the 30-day virtual internship in {domain_label}"
    )

    completion_date = datetime.utcnow().strftime("%d %B %Y")
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, height - 118 * mm, f"Issued on {completion_date}")

    # Footer: certificate number + QR
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#555555"))
    c.drawString(30 * mm, 25 * mm, f"Certificate No: {certificate.certificate_number}")
    c.drawString(30 * mm, 20 * mm, f"Verify at: {verification_url}")

    if os.path.exists(qr_abs_path):
        c.drawImage(qr_abs_path, width - 55 * mm, 15 * mm, width=30 * mm, height=30 * mm, mask="auto")

    c.showPage()
    c.save()

    return f"/certificates/{filename}", qr_path_relative, verification_url
