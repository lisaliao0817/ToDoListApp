from flask import Blueprint, request, jsonify, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required
from database import db
from models import User
import jwt
import datetime

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

    token = jwt.encode({
        'user_id': user.id, 
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, 'YOUR_SECRET_KEY', algorithm="HS256")

    return jsonify({'token': token}), 200

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

