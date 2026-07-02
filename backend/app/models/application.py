import uuid
import random
import string
from datetime import datetime, timedelta
from app.extensions import db

DOMAIN_CHOICES = ("web_development", "data_analytics")
APPLICATION_STATUS = ("pending_payment", "active", "completed", "expired", "rejected")


def _gen_application_id():
    return "SSH-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.String(20), unique=True, default=_gen_application_id)

    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    domain = db.Column(db.String(30), nullable=False)  # web_development | data_analytics
    status = db.Column(db.String(30), default="pending_payment")

    joined_date = db.Column(db.DateTime)
    expiry_date = db.Column(db.DateTime)

    digital_id = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    qr_code_url = db.Column(db.String(500))

    offer_letter_url = db.Column(db.String(500))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    payment = db.relationship("Payment", backref="application", uselist=False, cascade="all, delete-orphan")
    tasks = db.relationship("TaskSubmission", backref="application", lazy=True, cascade="all, delete-orphan")
    certificate = db.relationship("Certificate", backref="application", uselist=False, cascade="all, delete-orphan")

    def activate(self, duration_days=30):
        self.status = "active"
        self.joined_date = datetime.utcnow()
        self.expiry_date = self.joined_date + timedelta(days=duration_days)

    def days_left(self):
        if not self.expiry_date:
            return None
        delta = self.expiry_date - datetime.utcnow()
        return max(delta.days, 0)

    def to_dict(self):
        return {
            "id": self.id,
            "application_id": self.application_id,
            "domain": self.domain,
            "status": self.status,
            "joined_date": self.joined_date.isoformat() if self.joined_date else None,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "days_left": self.days_left(),
            "digital_id": self.digital_id,
            "qr_code_url": self.qr_code_url,
            "offer_letter_url": self.offer_letter_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
