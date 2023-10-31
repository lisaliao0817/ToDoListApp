from flask import Flask
from flask_cors import CORS
from flask import jsonify
from database import db
from auth import jwt
from jwt import ExpiredSignatureError
import os


def create_app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'
    
    CORS(app, supports_credentials=True)

    db_path = os.path.join(os.getcwd(), 'db.sqlite')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path

    app.config['SECRET_KEY'] = 'secret-key-goes-here'

    jwt.init_app(app)
    db.init_app(app)
    
    @app.errorhandler(ExpiredSignatureError)
    def handle_expired_token(e):
        return jsonify({"error": "Token has expired"}), 401

    from models import User
    
    with app.app_context():
        db.create_all()

    # blueprint for auth routes in our app
    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from routes import api
    app.register_blueprint(api)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)  # You can set debug to False in a production environment
