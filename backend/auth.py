from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from database import db
from models import User

auth = Blueprint('auth', __name__, url_prefix='/api/v1')

# Setting up Flask-JWT-Extended
jwt = JWTManager()

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

    # Instead of login_user, we'll generate a JWT
    access_token = create_access_token(identity=email)
    return jsonify({'message': 'Logged in successfully!', 'access_token': access_token}), 200

@auth.route('/logout', methods=['POST'])
@jwt_required()  # Requires a valid access token to access
def logout():
    # With stateless JWT authentication, you can't truly "logout" a token.
    # However, you can implement token revocation, or the front end can simply discard the token.
    # For now, we'll return a successful message.
    return jsonify({'message': 'Logged out successfully!'}), 200
