from complaintsapp.mod_users.auth import roles_allowed
from flask import request, Blueprint, jsonify
from flask_jwt_extended import unset_jwt_cookies, create_access_token, get_jwt_identity, jwt_required, set_access_cookies
# from flask_expects_json import expects_json
from complaintsapp import db, bcrypt
from datetime import datetime, timedelta, timezone
from complaintsapp.mod_users.model import User, Role, roles_users_table

applet = Blueprint('users', __name__, url_prefix='/api/users')

# user_schema = {
#     'type': 'object',
#     'properties': {
#         'name': {'type': 'string'},
#         'email': {'type': 'string'},
#         'phone': {'type': 'string'},
#         'role': {'type': 'string'},
#         'password': {'type': 'string'},
#         'active': {'type': 'boolean'}
#     },
#     'required': ['name', 'email', 'phone', 'role']
# }

# @jwt_required()
# @applet.after_request
# def refresh_expiring_jwts(response):
#     # try:
#     exp_timestamp = get_jwt()["exp"]
#     now = datetime.now(timezone.utc)
#     target_timestamp = datetime.timestamp(now + timedelta(minutes=2880))
#     if target_timestamp > exp_timestamp:
#         access_token = create_access_token(identity=get_jwt_identity())
#         set_access_cookies(response, access_token)
#     return response
#     # except (RuntimeError, KeyError):
#     #     return response


@applet.route('/verify', methods=['GET'])
@jwt_required()
def user_verify():
    regno = get_jwt_identity()
    user = User.query.filter_by(regno=regno).first()
    if(user):
        role = db.session.query(roles_users_table).join(Role).filter(roles_users_table.c.user_id==user.id and roles_users_table.c.role_id == Role.id).all()
        role = Role.query.filter_by(id=role[0][1]).first()
        return {'id': user.id, 'name': user.name, 'regno': user.regno, 'role': role.name}, 200
    return {'message': 'fail'}, 404


@applet.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400
    user = User.query.filter_by(id=user_id).first()
    if user:
        role = db.session.query(roles_users_table).join(Role).filter(roles_users_table.c.user_id == user.id and roles_users_table.c.role_id == Role.id).all()
        role = Role.query.filter_by(id=role[0][1]).first()
        return {'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone, 'role': role.name}, 200
    return {'message': 'fail'}, 404


# user_update_schema = {
#     'type': 'object',
#     'properties': {
#         'name': {'type': 'string'},
#         'phone': {'type': 'string'},
#     },
#     'required': ['name', 'phone']
# }


@applet.route('/<user_id>', methods=['PUT'])
@jwt_required()
# @expects_json(user_update_schema, force=True)
def edit_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400
    content = request.get_json(silent=True)
    user = User.query.filter_by(id=user_id).first()
    user_phone = User.query.filter_by(phone=content['phone']).first()
    if user.phone == content['phone'] or user_phone is None:
        user.name = content['name']
        user.phone = content['phone']
        # user.active = content['active']
        db.session.commit()
        db.session.remove()
        return {"message": "Changes saved"}, 200
    return {'message': 'Changes not saved'}, 409


@applet.route('/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400
    user = User.query.filter_by(id=user_id).first()
    if not user:
        db.session.remove()
        return {'message': 'User with the ID does not exist'}, 400
    user.active = False
    db.session.commit()
    return '', 204


# @applet.route('/collectors', methods=['GET'])
# @jwt_required()
# def get_all_collectors():
#     try:
#         role = [r[0] for r in db.session.query(roles_users_table).filter_by(role_id=2).all()]
#         collectors = User.query.filter(User.id.in_(role)).all()
#         response = jsonify([collector.to_dict() for collector in collectors])
#         return response
#     except:
#         return {'message': 'server error'}, 500


# @applet.route('/admins', methods=['GET'])
# @jwt_required()
# def get_all_admins():
#     try:
#         role = [r[0] for r in db.session.query(roles_users_table).filter_by(role_id=1).all()]
#         admins = User.query.filter(User.id.in_(role)).all()
#         response = jsonify([admin.to_dict() for admin in admins])
#         return response
#     except:
#         return {'message': 'server error'}, 500


@applet.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response


@applet.route('/signup', methods=['POST'])
# @jwt_required()
# @expects_json(user_schema, force=True)
def signup():
    content = request.get_json(silent=True)
    name = content['name']
    regno = content['regno']
    role = content['userType']
    password = bcrypt.generate_password_hash(content['password']).decode('utf-8', "ignore")
    if User.query.filter_by(regno=regno).first():
        db.session.remove()
        return {'message': 'User exists'}, 409
    role = db.session.query(Role).filter_by(name=role).first()
    user = User(name=name, regno=regno, password=password)
    user.roles.append(role)
    db.session.add(user)
    db.session.commit()
    role = db.session.query(roles_users_table).join(Role).filter(roles_users_table.c.user_id == user.id and roles_users_table.c.role_id == Role.id).all()
    role = Role.query.filter_by(id=role[0][1]).first()
    db.session.remove()
    response = jsonify({'id': user.id, 'name': user.name, 'regno': user.regno, 'role': role.name})
    access_token = create_access_token(identity=regno)
    set_access_cookies(response, access_token)
    return response


@applet.route('/login', methods=['POST'])
def login():
    content = request.get_json()
    regno = content['regno']
    password = content['password']
    if regno:
        user = User.query.filter_by(regno=regno).first()
        if user and bcrypt.check_password_hash(user.password, password):
            role = db.session.query(roles_users_table).join(Role).filter(roles_users_table.c.user_id==user.id and roles_users_table.c.role_id == Role.id).all()
            role = Role.query.filter_by(id=role[0][1]).first()
            db.session.remove()
            response = jsonify(
                {'id': user.id, 'name': user.name, 'regno': user.regno, 'role': role.name})
            access_token = create_access_token(identity=regno)
            set_access_cookies(response, access_token)
            return response
    return {'message': 'Invalid email or password'}, 401

@applet.route('/change-password',methods=['POST'])
@jwt_required()
@roles_allowed('admin', 'collector')
def change():
    content = request.get_json()
    user_id = content['user_id']
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {"message": "User not found"}, 404
    new_password = bcrypt.generate_password_hash(content['password']).decode('utf-8')  
    user.password = new_password
    db.session.commit()
    return {"message": "Password Changed Successfully"}, 200
