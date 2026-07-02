import os
import qrcode
from flask import current_app


def generate_qr_code(data: str, filename: str) -> str:
    """
    Generates a QR code PNG for `data`, saves it under UPLOAD_FOLDER/qrcodes/,
    and returns a relative URL path to serve it.
    """
    folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "qrcodes")
    os.makedirs(folder, exist_ok=True)

    img = qrcode.make(data)
    filepath = os.path.join(folder, filename)
    img.save(filepath)

    return f"/uploads/qrcodes/{filename}"
