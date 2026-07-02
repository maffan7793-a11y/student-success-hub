import os
from flask import Flask, app, send_from_directory, jsonify

from app.config import Config
from app.extensions import db, migrate, jwt, cors, mail, limiter


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["CERTIFICATE_FOLDER"], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}}, supports_credentials=True)

    # Blueprints
    from app.routes.auth import auth_bp
    from app.routes.applications import applications_bp
    from app.routes.payments import payments_bp
    from app.routes.tasks import tasks_bp
    from app.routes.students import students_bp
    from app.routes.certificates import certificates_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(applications_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(certificates_bp)
    app.register_blueprint(admin_bp)

    # Serve generated files (uploads / certificates)
    @app.route("/uploads/<path:subpath>")
    def uploaded_file(subpath):
        return send_from_directory(app.config["UPLOAD_FOLDER"], subpath)

    @app.route("/certificates/<path:filename>")
    def certificate_file(filename):
        return send_from_directory(app.config["CERTIFICATE_FOLDER"], filename)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/")
    def home():
        return jsonify({
        "message": "Student Success Hub Backend is running successfully!"
    })

# ---- Error handlers ----

    # ---- Error handlers ----
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        app.logger.exception(e)
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(429)
    def rate_limited(e):
        return jsonify({"error": "Too many requests, please slow down"}), 429

    return app
