from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import datetime, date
import re


auth_bp = Blueprint("auth", __name__)


# =====================================
# REGISTER
# =====================================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    print("REGISTER DATA:", data)

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    surgery_type = data.get("surgery_type", "").strip().lower()
    surgery_date_text = data.get("surgery_date", "").strip()

    if not all([name, email, password, surgery_type, surgery_date_text]):
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({
            "success": False,
            "message": "Invalid email address."
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters."
        }), 400

    if surgery_type not in ["partial", "total"]:
        return jsonify({
            "success": False,
            "message": "Invalid surgery type."
        }), 400

    try:
        surgery_date = datetime.strptime(
            surgery_date_text, "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Invalid surgery date."
        }), 400

    if surgery_date > date.today():
        return jsonify({
            "success": False,
            "message": "Surgery date cannot be in the future."
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered."
        }), 409

    user = User(
        name=name,
        email=email,
        surgery_type=surgery_type,
        surgery_date=surgery_date
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Account created successfully!"
    }), 201


# =====================================
# LOGIN
# =====================================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message": "Login successful!",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "surgery_type": user.surgery_type,
            "surgery_date": (
                user.surgery_date.isoformat()
                if user.surgery_date else None
            )
        }
    }), 200


# =====================================
# GET CURRENT USER
# =====================================
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():

    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "surgery_type": user.surgery_type,
            "surgery_date": (
                user.surgery_date.isoformat()
                if user.surgery_date else None
            )
        }
    }), 200




