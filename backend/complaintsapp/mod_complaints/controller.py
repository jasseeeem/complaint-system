from flask import json, request, Blueprint, jsonify
from complaintsapp import db
from flask_jwt_extended import jwt_required
from complaintsapp.mod_complaints.model import Complaint, Tag, Vote 

applet = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@applet.route('/', methods=['POST'])
@jwt_required()
def add_complaint():
    content = request.get_json(silent=True)
    title = content['title']
    description = content['description']
    image = content['image']
    user_id = content['user_id']
    complaint = Complaint(title=title, description=description, image=image, user_id=user_id)
    db.session.add(complaint)
    db.session.commit()
    db.session.remove()
    return jsonify({'message': 'Complaint added successfully'}, 201)

# @applet.route('/<complaint_id>', methods=['PUT'])
# @jwt_required()
# def edit_complaint():


# @applet.route('/<complaint_id>', methods=['DELTE'])
# @jwt_required()
# def delete_complaint():
