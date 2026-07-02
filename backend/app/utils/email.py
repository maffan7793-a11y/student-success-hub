from flask_mail import Message
from flask import current_app
from app.extensions import mail


def _send(subject: str, recipients: list, html_body: str):
    """
    Sends an email. Failures are logged, not raised, so a flaky SMTP
    connection never breaks a student-facing request (payment, task
    approval, etc).
    """
    try:
        msg = Message(subject=subject, recipients=recipients, html=html_body)
        mail.send(msg)
    except Exception as exc:  # noqa: BLE001
        current_app.logger.error(f"Failed to send email '{subject}' to {recipients}: {exc}")


def send_welcome_email(student):
    html = f"""
    <h2>Welcome to Student Success Hub, {student.full_name}!</h2>
    <p>Your account has been created successfully. Log in to your dashboard to apply
    for an internship and get started.</p>
    """
    _send("Welcome to Student Success Hub", [student.email], html)


def send_offer_letter_email(student, application):
    html = f"""
    <h2>Congratulations, {student.full_name}!</h2>
    <p>Your payment was successful and your internship application
    <strong>{application.application_id}</strong> is now active.</p>
    <p>Domain: {application.domain.replace('_', ' ').title()}</p>
    <p>Your official offer letter is available for download from your dashboard.</p>
    """
    _send("Your Internship Offer Letter", [student.email], html)


def send_task_approval_email(student, task_submission, approved: bool):
    status = "approved" if approved else "sent back for changes"
    html = f"""
    <h2>Task Update</h2>
    <p>Hi {student.full_name}, your submission for
    <strong>Task {task_submission.task_number}: {task_submission.title}</strong>
    has been {status}.</p>
    {f"<p><strong>Feedback:</strong> {task_submission.feedback}</p>" if task_submission.feedback else ""}
    """
    _send(f"Task {task_submission.task_number} {status.title()}", [student.email], html)


def send_certificate_ready_email(student, certificate):
    html = f"""
    <h2>Your Certificate is Ready!</h2>
    <p>Hi {student.full_name}, congratulations on completing your internship.</p>
    <p>Certificate Number: <strong>{certificate.certificate_number}</strong></p>
    <p>You can download it anytime from your dashboard.</p>
    """
    _send("Your Internship Certificate is Ready", [student.email], html)


def send_password_reset_email(student, reset_url):
    html = f"""
    <h2>Reset Your Password</h2>
    <p>Hi {student.full_name}, click the link below to reset your password.
    This link expires in 1 hour.</p>
    <p><a href="{reset_url}">{reset_url}</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    """
    _send("Reset Your Password", [student.email], html)
