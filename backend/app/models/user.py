import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))

    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    college = db.Column(db.String(200))
    course = db.Column(db.String(120))
    graduation_year = db.Column(db.Integer)

    profile_photo_url = db.Column(db.String(500))
    skills = db.Column(db.String(500))  # comma separated
    github_url = db.Column(db.String(300))
    linkedin_url = db.Column(db.String(300))
    resume_url = db.Column(db.String(500))

    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)

    reset_token = db.Column(db.String(255))
    reset_token_expires = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = db.relationship("Application", backref="student", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "public_id": self.public_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "college": self.college,
            "course": self.course,
            "graduation_year": self.graduation_year,
            "profile_photo_url": self.profile_photo_url,
            "skills": self.skills.split(",") if self.skills else [],
            "github_url": self.github_url,
            "linkedin_url": self.linkedin_url,
            "resume_url": self.resume_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), default="admin")  # admin | super_admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "full_name": self.full_name, "email": self.email, "role": self.role}
