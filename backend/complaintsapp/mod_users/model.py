from complaintsapp import db
from sqlalchemy.orm import relationship, Session
from sqlalchemy_serializer import SerializerMixin

roles_users_table = db.Table(
    'users_roles',
    db.Column('user_id', db.Integer(), db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('roles.id'))
)

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)
    def __str__(self):
        return self.name

class User(db.Model, SerializerMixin):
    """ User Model """
    serialize_rules = ('-password',)
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    rollNo = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    roles = relationship('Role', secondary=roles_users_table)