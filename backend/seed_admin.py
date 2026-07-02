"""
Run once after your first deploy to create the initial admin account:

    python seed_admin.py

Reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment (see .env.example).
"""
import os
from app import create_app
from app.extensions import db
from app.models import Admin

app = create_app()

with app.app_context():
    email = os.environ.get("ADMIN_EMAIL", "admin@studentsuccesshub.com")
    password = os.environ.get("ADMIN_PASSWORD", "change-this-admin-password")

    existing = Admin.query.filter_by(email=email).first()
    if existing:
        print(f"Admin already exists: {email}")
    else:
        admin = Admin(full_name="Platform Admin", email=email, role="super_admin")
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin created: {email}")
