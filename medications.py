from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Medication
from database import db


medications_bp = Blueprint("medications", __name__)


# Get all medications for the logged-in user
@medications_bp.route("/", methods=["GET"])
@jwt_required()
def get_medications():

    user_id = int(get_jwt_identity())

    medications = Medication.query.filter_by(
        user_id=user_id
    ).order_by(Medication.created_at.desc()).all()

    result = []

    for med in medications:
        result.append({
            "id": med.id,
            "name": med.name,
            "dose": med.dose,
            "time": med.time,
            "notes": med.notes,
            "taken": med.taken
        })

    return jsonify(result), 200


# Add new medication
@medications_bp.route("/", methods=["POST"])
@jwt_required()
def add_medication():

    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    name = data.get("name", "").strip()
    dose = data.get("dose", "").strip()
    time = data.get("time", "").strip()

    if not name or not dose or not time:
        return jsonify({"message": "Name, dose and time are required"}), 400

    medication = Medication(
        user_id=user_id,
        name=name,
        dose=dose,
        time=time,
        notes=data.get("notes", "").strip(),
        taken=False
    )

    db.session.add(medication)
    db.session.commit()

    return jsonify({
        "message": "Medication added successfully",
        "medication_id": medication.id
    }), 201


# Update medication status
@medications_bp.route("/<int:medication_id>", methods=["PATCH"])
@jwt_required()
def update_medication(medication_id):

    user_id = int(get_jwt_identity())

    medication = Medication.query.filter_by(
        id=medication_id,
        user_id=user_id
    ).first()

    if not medication:
        return jsonify({"message": "Medication not found"}), 404

    data = request.get_json() or {}

    if "taken" in data:
        medication.taken = bool(data["taken"])

    db.session.commit()

    return jsonify({
        "message": "Medication updated successfully"
    }), 200


# Delete medication
@medications_bp.route("/<int:medication_id>", methods=["DELETE"])
@jwt_required()
def delete_medication(medication_id):

    user_id = int(get_jwt_identity())

    medication = Medication.query.filter_by(
        id=medication_id,
        user_id=user_id
    ).first()

    if not medication:
        return jsonify({"message": "Medication not found"}), 404

    db.session.delete(medication)
    db.session.commit()

    return jsonify({
        "message": "Medication deleted successfully"
    }), 200