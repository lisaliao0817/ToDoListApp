from flask import Blueprint, request, jsonify, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from database import db
from models import User

auth = Blueprint('auth', __name__, url_prefix='/api/v1')

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data['email']
    password = data['password']
    
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'message': 'Email address already exists!'}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Successfully signed up! Please login.'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Please check your login details and try again.'}), 401

    login_user(user)  # Log the user in using Flask-Login
    return jsonify({'message': 'Logged in successfully!'}), 200

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully!'}), 200



