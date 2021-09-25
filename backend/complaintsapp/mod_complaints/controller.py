from datetime import datetime, tzinfo
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
    hostel = content["hostel"]
    room = content["room"]
    image = content['image']
    user_id = content['user_id']
    hostel = content['hostel']
    complaint = Complaint(title=title, description=description, image=image, user_id=user_id, room_no=room, hostel_id=hostel, votes=0, set_time=datetime.utcnow() )
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

@applet.route('/sort/<sort_type>', methods=['GET'])
@jwt_required()
def get_all_complaints(sort_type):
    try:
        sort_type = int(sort_type)
    except:
        return {'message': 'wrong endpoint'} , 404
    complaints = None
    if sort_type == 0:
        complaints = Complaint.query.order_by(Complaint.set_time.desc()).limit(10).all()
    elif sort_type == 1:
        complaints = Complaint.query.limit(10).all()
    elif sort_type == 2:
        pass
    elif sort_type == 3:
        pass
        
    response = [complaint.to_dict() for complaint in complaints]
    for complaint in response:
        likes = Vote.query.filter(Vote.complaint_id == complaint['id']).all()
        likes = [like.to_dict() for like in likes]
        complaint['likes'] = likes
    return jsonify(response), 200
    # except:
    #     return {'message': 'complaints list cannot be fetched'}, 500
