from complaintsapp.mod_users.auth import roles_allowed
from flask import request, Blueprint, jsonify
from complaintsapp import db
from complaintsapp.mod_users.model import User, Role, roles_users_table

applet = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@applet.route('/<complaint_id>', methods=['POST'])
@jwt_required()
def add_complaint():


@applet.route('/<complaint_id>', methods=['PUT'])
@jwt_required()
def edit_complaint():


@applet.route('/<complaint_id>', methods=['DELTE'])
@jwt_required()
def edit_complaint():
