import hmac
import hashlib

import razorpay
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import Application, Payment, Student, TaskSubmission
from app.models.task import TASK_CATALOG
from app.utils.decorators import student_required
from app.utils.email import send_offer_letter_email

payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments")


def _razorpay_client():
    return razorpay.Client(auth=(current_app.config["RAZORPAY_KEY_ID"], current_app.config["RAZORPAY_KEY_SECRET"]))


@payments_bp.route("/create-order", methods=["POST"])
@student_required
def create_order():
    """
    Step 3 of the apply flow. Creates a Razorpay order for a pending
    application and returns the order details the frontend needs to
    open Razorpay Checkout.
    """
    student_id = int(get_jwt_identity())
    data = request.get_json(force=True, silent=True) or {}
    application_id = data.get("application_id")

    application = Application.query.filter_by(
        application_id=application_id, student_id=student_id, status="pending_payment"
    ).first()
    if not application:
        return jsonify({"error": "No pending application found for that ID"}), 404

    amount = current_app.config["INTERNSHIP_FEE_PAISE"]

    try:
        client = _razorpay_client()
        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "receipt": application.application_id,
            "notes": {"application_id": application.application_id, "student_id": str(student_id)},
        })
    except Exception as exc:  # noqa: BLE001
        current_app.logger.error(f"Razorpay order creation failed: {exc}")
        return jsonify({"error": "Unable to initiate payment right now. Please try again."}), 502

    payment = Payment(
        application_id=application.id,
        razorpay_order_id=order["id"],
        amount_paise=amount,
        status="created",
    )
    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "order_id": order["id"],
        "amount": amount,
        "currency": "INR",
        "key_id": current_app.config["RAZORPAY_KEY_ID"],
        "application_id": application.application_id,
    })


@payments_bp.route("/verify", methods=["POST"])
@student_required
def verify_payment():
    """
    Step 4: called by the frontend after Razorpay Checkout succeeds.
    Verifies the signature server-side, marks the payment paid, activates
    the application, seeds its task rows, and sends the offer letter email.
    """
    student_id = int(get_jwt_identity())
    data = request.get_json(force=True, silent=True) or {}

    required = ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature"]
    if any(not data.get(f) for f in required):
        return jsonify({"error": "Missing Razorpay verification fields"}), 400

    payment = Payment.query.filter_by(razorpay_order_id=data["razorpay_order_id"]).first()
    if not payment or payment.application.student_id != student_id:
        return jsonify({"error": "Payment record not found"}), 404

    # Verify HMAC-SHA256 signature: order_id|payment_id signed with key secret
    secret = current_app.config["RAZORPAY_KEY_SECRET"].encode()
    payload = f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}".encode()
    expected_signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected_signature, data["razorpay_signature"]):
        payment.status = "failed"
        db.session.commit()
        return jsonify({"error": "Payment signature verification failed"}), 400

    from datetime import datetime
    payment.razorpay_payment_id = data["razorpay_payment_id"]
    payment.razorpay_signature = data["razorpay_signature"]
    payment.status = "paid"
    payment.paid_at = datetime.utcnow()

    application = payment.application
    application.activate(duration_days=current_app.config["INTERNSHIP_DURATION_DAYS"])

    # Seed task rows from the static catalog for this domain
    for task_def in TASK_CATALOG[application.domain]:
        db.session.add(TaskSubmission(
            application_id=application.id,
            task_number=task_def["task_number"],
            title=task_def["title"],
            status="not_started",
        ))

    db.session.commit()

    student = Student.query.get(student_id)
    send_offer_letter_email(student, application)

    return jsonify({"message": "Payment verified, internship activated", "application": application.to_dict()})


@payments_bp.route("/webhook", methods=["POST"])
def razorpay_webhook():
    """
    Optional server-to-server confirmation from Razorpay, as a safety net
    in case the client never calls /verify (e.g. tab closed after payment).
    Configure this URL + a webhook secret in the Razorpay dashboard.
    """
    webhook_signature = request.headers.get("X-Razorpay-Signature", "")
    webhook_secret = current_app.config.get("RAZORPAY_KEY_SECRET", "")

    expected = hmac.new(webhook_secret.encode(), request.data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, webhook_signature):
        return jsonify({"error": "Invalid webhook signature"}), 400

    event = request.get_json(force=True, silent=True) or {}
    current_app.logger.info(f"Razorpay webhook received: {event.get('event')}")
    # Reconciliation logic (mark orphaned 'created' payments as 'paid') can be added here.
    return jsonify({"status": "ok"})
