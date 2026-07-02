from datetime import datetime
from app.extensions import db

# Static task catalog per domain. Order matters (task_number).
TASK_CATALOG = {
    "web_development": [
        {"task_number": 1, "title": "Portfolio Website",
         "description": "Build and deploy a personal portfolio website showcasing your skills and projects.",
         "tutorial_url": "https://youtube.com/placeholder-portfolio"},
        {"task_number": 2, "title": "Responsive Landing Page",
         "description": "Design and code a fully responsive product landing page using modern CSS.",
         "tutorial_url": "https://youtube.com/placeholder-landing"},
        {"task_number": 3, "title": "CRUD Flask Project",
         "description": "Build a full CRUD application with a Flask backend and a database.",
         "tutorial_url": "https://youtube.com/placeholder-crud"},
        {"task_number": 4, "title": "Authentication System",
         "description": "Implement a secure login/register system with JWT-based authentication.",
         "tutorial_url": "https://youtube.com/placeholder-auth"},
        {"task_number": 5, "title": "Deploy Final Full Stack Project",
         "description": "Combine everything you've learned into a deployed full stack capstone project.",
         "tutorial_url": "https://youtube.com/placeholder-capstone"},
    ],
    "data_analytics": [
        {"task_number": 1, "title": "Data Cleaning",
         "description": "Clean and preprocess a raw, messy dataset for analysis.",
         "tutorial_url": "https://youtube.com/placeholder-cleaning",
         "dataset_url": "/datasets/data-cleaning-starter.csv"},
        {"task_number": 2, "title": "Exploratory Data Analysis",
         "description": "Perform EDA on a dataset and summarize key findings with visualizations.",
         "tutorial_url": "https://youtube.com/placeholder-eda",
         "dataset_url": "/datasets/eda-starter.csv"},
        {"task_number": 3, "title": "Customer Churn Analysis",
         "description": "Analyze a customer churn dataset and identify key churn drivers.",
         "tutorial_url": "https://youtube.com/placeholder-churn",
         "dataset_url": "/datasets/churn-dataset.csv"},
        {"task_number": 4, "title": "Power BI Dashboard",
         "description": "Build an interactive Power BI dashboard from a provided dataset.",
         "tutorial_url": "https://youtube.com/placeholder-powerbi",
         "dataset_url": "/datasets/powerbi-dataset.csv"},
        {"task_number": 5, "title": "Final Analytics Project",
         "description": "Deliver an end-to-end analytics project with a written report and dashboard.",
         "tutorial_url": "https://youtube.com/placeholder-final-analytics",
         "dataset_url": "/datasets/final-project-dataset.csv"},
    ],
}

SUBMISSION_STATUS = ("not_started", "pending", "approved", "rejected")


class TaskSubmission(db.Model):
    """
    One row per (application, task_number). Rows are created automatically
    when an application is activated (see services in routes/applications.py).
    """
    __tablename__ = "task_submissions"

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey("applications.id"), nullable=False)

    task_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)

    github_url = db.Column(db.String(300))
    live_url = db.Column(db.String(300))
    report_url = db.Column(db.String(300))  # Google Drive report (data analytics)

    status = db.Column(db.String(20), default="not_started")
    feedback = db.Column(db.Text)

    submitted_at = db.Column(db.DateTime)
    reviewed_at = db.Column(db.DateTime)

    __table_args__ = (db.UniqueConstraint("application_id", "task_number", name="uq_app_task"),)

    def to_dict(self):
        return {
            "id": self.id,
            "task_number": self.task_number,
            "title": self.title,
            "github_url": self.github_url,
            "live_url": self.live_url,
            "report_url": self.report_url,
            "status": self.status,
            "feedback": self.feedback,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
        }
