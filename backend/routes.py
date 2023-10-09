from app import app
from database import db
from models import Task, User
from flask import request, jsonify
from flask_login import login_required, current_user


@app.route('/tasks', methods=['POST'])
@login_required
def create_task():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    # Associate the task with the logged-in user
    task = Task(title=data['title'], status=data['status'], user_id=current_user.id)
    db.session.add(task)
    db.session.commit()
    return jsonify(task.serialize()), 201


@app.route('/tasks', methods=['GET'])
@login_required
def get_tasks():
    # Fetch tasks that belong to the logged-in user
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([task.serialize() for task in tasks]), 200

@app.route('/tasks/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    # Check if the task belongs to the logged-in user
    if task.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    task.title = data['title']
    task.status = data['status']
    db.session.commit()
    return jsonify(task.serialize()), 200

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"message": "Task not found"}), 404

    # Check if the task belongs to the logged-in user
    if task.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 200
