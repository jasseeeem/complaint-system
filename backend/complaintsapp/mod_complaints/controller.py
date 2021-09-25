from flask import json, request, Blueprint, jsonify
from complaintsapp import db
from flask_jwt_extended import jwt_required
from complaintsapp.mod_complaints.model import Complaint, Tag, Vote 

applet = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@applet.route('/', methods=['POST'])
# @jwt_required()
def add_complaint():
    content = request.get_json(silent=True)
    title = content['title']
    description = content['description']
    image = content['image']
    user_id = content['user_id']
    hostel = content['hostel']
    room = content['room']
    complaint = Complaint(title=title, description=description, image=image, user_id=user_id, room=room, hostel_id=hostel)
    #print(complaint)
    db.session.add(complaint)
    db.session.commit()
    db.session.remove()
    return jsonify({'message': 'Complaint added successfully'}, 201)

@applet.route('/<complaint_id>/like', methods=['POST'])
# @jwt_required()
def like_complaint(complaint_id):
    content = request.get_json(silent=True)
    user_id = content['user_id']
    like = Vote.query.filter(Vote.user_id == user_id).filter(Vote.complaint_id == complaint_id).first()
    if not like:
        like = Vote(user_id=user_id, complaint_id=complaint_id)
        db.session.add(like)
        db.session.commit()
        db.session.remove()
        return jsonify({'message': "post liked"}, 201)
    db.session.delete(like)
    db.session.commit()
    return jsonify({'message': 'post unliked'}, 204)

# @applet.route('/<complaint_id>', methods=['PUT'])
# @jwt_required()
# def edit_complaint():


# @applet.route('/<complaint_id>', methods=['DELTE'])
# @jwt_required()
# def delete_complaint():

@applet.route('/', methods=['GET'])
@jwt_required()
def get_all_complaints():
    # try:/
        # role = [r[0] for r in db.session.query(roles_users_table).filter_by(role_id=1).all()]
    complaints = Complaint.query.limit(10).all()
    response = [complaint.to_dict() for complaint in complaints]
    for complaint in response:
        likes = Vote.query.filter(Vote.complaint_id == complaint['id']).all()
        likes = [like.to_dict() for like in likes]
        complaint['likes'] = likes
    return jsonify(response), 200
    # except:
    #     return {'message': 'complaints list cannot be fetched'}, 500
