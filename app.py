from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from routes.auth import auth_bp
from routes.health import health_bp
from routes.medications import medications_bp

app = Flask(__name__)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///recovery.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT configuration
app.config["JWT_SECRET_KEY"] = "RecoveryCompanion-Local-Dev-2026-Change-Before-Deployment"
from datetime import timedelta

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=7)

# Initialize extensions
CORS(app)
db.init_app(app)
jwt = JWTManager(app)

# Register authentication routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(health_bp, url_prefix="/api/health")
app.register_blueprint(medications_bp, url_prefix="/api/medications")

# Import models
from models import User, HealthCheck, Medication


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Recovery Companion Backend is Running!"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "OK",
        "project": "Recovery Companion",
        "database": "Connected"
    })


if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    print("Database connected successfully!")
    print("Authentication API is ready!")

    app.run(debug=True, port=5000)