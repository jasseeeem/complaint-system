from sqlalchemy.orm.relationships import foreign
from complaintsapp import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, Session
from sqlalchemy_serializer import SerializerMixin

class Vote(db.Model, SerializerMixin):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    def __str__(self):
        return self.name

class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(50), nullable=False)
    def __str__(self):
        return self.name

class Hostel(db.Model, SerializerMixin):
    __tablename__ = 'hostels'
    id = db.Column(db.Integer, primary_key=True)
    hostel_name = db.Column(db.String(50), nullable=False)
    def __str__(self):
        return self.name

class Complaint(db.Model, SerializerMixin):
    """ Complaints Model """
    __tablename__ = "complaints"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    hostel_id = db.Column(db.Integer, ForeignKey('hostels.id', ondelete='SET NULL'), nullable=True)
    room_no = db.Column(db.Integer)
    votes = db.Column(db.Integer)
    set_time = db.Column(db.DateTime)
    user = relationship('User')
