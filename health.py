

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import HealthCheck
from database import db

health_bp = Blueprint("health", __name__)


# Save Daily Check-in
@health_bp.route("/checkin", methods=["POST"])
@jwt_required()
def save_checkin():

    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    checkin = HealthCheck(
        user_id=user_id,
        pain=data.get("pain"),
        wound=data.get("wound"),
        swelling=data.get("swelling"),
        fatigue=data.get("fatigue"),
        notes=data.get("notes")
    )

    db.session.add(checkin)
    db.session.commit()

    return jsonify({
        "message": "Daily check-in saved successfully",
        "checkin_id": checkin.id
    }), 201


# Get Daily Check-ins
@health_bp.route("/checkin", methods=["GET"])
@jwt_required()
def get_checkins():

    user_id = int(get_jwt_identity())

    checkins = HealthCheck.query.filter_by(
        user_id=user_id
    ).order_by(HealthCheck.created_at.desc()).all()

    result = []

    for item in checkins:
        result.append({
            "id": item.id,
            "pain": item.pain,
            "wound": item.wound,
            "swelling": item.swelling,
            "fatigue": item.fatigue,
            "notes": item.notes,
            "created_at": item.created_at.isoformat() if item.created_at else None
        })

    return jsonify(result), 200
	