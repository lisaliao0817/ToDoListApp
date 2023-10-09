from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from auth import auth as auth_blueprint
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'  # This means the tasks.db file will be in the root of your project directory.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Suppress a warning message


login_manager = LoginManager()
login_manager.init_app(app)

from models import User  

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

import routes