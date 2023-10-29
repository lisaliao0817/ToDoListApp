from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
import os
from database import db
from flask import jsonify
from datetime import timedelta

def create_app():
    app = Flask(__name__)

    # CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    CORS(app, supports_credentials=True)
    db_path = os.path.join(os.getcwd(), 'db.sqlite')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path

    app.config['SECRET_KEY'] = 'secret-key-goes-here'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        print(f"Loading user with ID: {user_id}")
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'message': 'Unauthorized access'}), 401

    from models import User
    

    with app.app_context():
        db.create_all()



    
    # blueprint for auth routes in our app
    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from routes import api
    app.register_blueprint(api)

    return app
