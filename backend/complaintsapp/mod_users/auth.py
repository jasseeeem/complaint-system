from functools import wraps

import flask
from complaintsapp.mod_users.model import User
from flask_jwt_extended import get_jwt_identity

def roles_allowed(*roles):
    """
Decorator for handlers for checking if the logged in user at least one of the roles listed in the argument.
This decorator also adds the user object as part of the request context (ie. flask.g)

@jwt_required() should be added before this decorator

    :param roles: List of roles which are allowed for the API
    :return:
    """

    def role_checker(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            email = get_jwt_identity()
            user = User.query.filter_by(email=email).first()
            has_valid_role = False
            for role in user.roles:
                if str(role) in roles:
                    has_valid_role = True
                    break

            if not has_valid_role:
                flask.abort(flask.make_response(flask.jsonify({"message": "invalid role"}), 403))
            flask.g.user = user
            return f(*args, **kwargs)

        return decorated

    return role_checker


def has_role(user, expected_role):
    for role in user.roles:
        if str(role) == expected_role:
            return True
    return False
