from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from database import db


# =================================
# User Model
# =================================

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    language = db.Column(db.String(10), default="en")
    
    surgery_type = db.Column(db.String(20), nullable=True)
    surgery_date = db.Column(db.Date, nullable=True)

    voice_enabled = db.Column(db.Boolean, default=True)

    reminders_enabled = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# =================================
# Health Check Model
# =================================

class HealthCheck(db.Model):

    __tablename__ = "health_checks"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    pain = db.Column(db.Integer)

    wound = db.Column(db.String(50))

    swelling = db.Column(db.String(10))

    fatigue = db.Column(db.Integer)

    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# =================================
# Medication Model
# =================================

class Medication(db.Model):

    __tablename__ = "medications"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    name = db.Column(db.String(150), nullable=False)

    dose = db.Column(db.String(100))

    time = db.Column(db.String(50))

    notes = db.Column(db.Text)

    taken = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)