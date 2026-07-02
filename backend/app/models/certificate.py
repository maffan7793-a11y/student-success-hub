import random
import string
from datetime import datetime
from app.extensions import db


def _gen_certificate_number():
    return "SSH-CERT-" + "".join(random.choices(string.digits, k=6))


class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey("applications.id"), nullable=False)

    certificate_number = db.Column(db.String(30), unique=True, default=_gen_certificate_number)
    pdf_url = db.Column(db.String(500))
    qr_code_url = db.Column(db.String(500))
    verification_url = db.Column(db.String(500))

    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="issued")  # issued | revoked

    def to_dict(self):
        return {
            "id": self.id,
            "certificate_number": self.certificate_number,
            "pdf_url": self.pdf_url,
            "qr_code_url": self.qr_code_url,
            "verification_url": self.verification_url,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
            "status": self.status,
        }
