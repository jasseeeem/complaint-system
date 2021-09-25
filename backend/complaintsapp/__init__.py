import os
from datetime import timedelta

from flask_cors import CORS
from flask import Flask, g
from dotenv import load_dotenv
from flask_jwt_extended import  JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask("complaintsapp")
    
    global bcrypt
    bcrypt = Bcrypt(app)
    api_cors_config = {
        "origins": ["http://127.0.0.1:3000", "http://localhost:3000"],
        "supports_credentials": True
    }
    cors = CORS(app, resources={
        r"\/api\/.*": api_cors_config
    })

    app.config['CORS_ALLOW_CREDENTIALS'] = True
    app.config['JWT_SESSION_COOKIE'] = True
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    # app.config['JWT_CSRF_IN_COOKIES'] = 'False'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=10000)
    # app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    # app.config['JWT_CSRF_CHECK_FORM'] = True
    load_dotenv()
    app.url_map.strict_slashes = False

    # Setup the Flask-JWT-Extended extension
    app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
    global jwt
    jwt = JWTManager(app)

    global db
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)

    from complaintsapp.mod_users.controller import applet as users_applet
    from complaintsapp.mod_users.model import Role

    app.register_blueprint(users_applet)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)