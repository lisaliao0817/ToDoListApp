from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from database import db
from models import List, Task, SubTask

api = Blueprint('api', __name__, url_prefix='/api/')

# Create a new list
@api.route('/list', methods=['POST'])
@login_required
def create_list():
    try:
        data = request.json
        new_list = List(name=data['name'], user_id=current_user.id)
        db.session.add(new_list)
        db.session.commit()
        return jsonify({"message": "List created successfully", "id": new_list.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new task in a specific list
@api.route('/list/<int:list_id>/task', methods=['POST'])
@login_required
def create_task(list_id):
    try:
        data = request.json
        new_task = Task(title=data['title'], user_id=current_user.id, list_id=list_id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully", "id": new_task.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new subtask for a specific task
@api.route('/task/<int:task_id>/subtask', methods=['POST'])
@login_required
def create_subtask(task_id):
    try:
        data = request.json
        new_subtask = SubTask(title=data['title'], task_id=task_id)
        db.session.add(new_subtask)
        db.session.commit()
        return jsonify({"message": "Subtask added successfully", "id": new_subtask.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/list/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    try:
        list_to_delete = List.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not list_to_delete:
            return jsonify({"error": "List not found"}), 404
        db.session.delete(list_to_delete)
        db.session.commit()
        return jsonify({"message": "List deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/task/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    try:
        task_to_delete = Task.query.filter_by(id=task_id, user_id=current_user.id).first()
        if not task_to_delete:
            return jsonify({"error": "Task not found"}), 404
        db.session.delete(task_to_delete)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/subtask/<int:subtask_id>', methods=['DELETE'])
@login_required
def delete_subtask(subtask_id):
    try:
        subtask_to_delete = SubTask.query.filter_by(id=subtask_id).join(Task).filter_by(user_id=current_user.id).first()
        if not subtask_to_delete:
            return jsonify({"error": "Subtask not found"}), 404
        db.session.delete(subtask_to_delete)
        db.session.commit()
        return jsonify({"message": "Subtask deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/task/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    try:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        data = request.json
        task.title = data.get('title', task.title)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify(task.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/subtask/<int:subtask_id>', methods=['PUT'])
@login_required
def update_subtask(subtask_id):
    try:
        subtask = SubTask.query.filter_by(id=subtask_id).join(Task).filter_by(user_id=current_user.id).first()
        if not subtask:
            return jsonify({"error": "Subtask not found"}), 404
        data = request.json
        subtask.title = data.get('title', subtask.title)
        subtask.status = data.get('status', subtask.status)
        db.session.commit()
        return jsonify({
            "id": subtask.id,
            "title": subtask.title,
            "status": subtask.status
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/task/<int:task_id>/move/<int:new_list_id>', methods=['PUT'])
@login_required
def move_task(task_id, new_list_id):
    try:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        new_list = List.query.filter_by(id=new_list_id, user_id=current_user.id).first()
        if not new_list:
            return jsonify({"error": "New list not found"}), 404
        
        task.list_id = new_list_id
        db.session.commit()
        return jsonify({"message": f"Task moved to list {new_list.name}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/list/<int:list_id>', methods=['PUT'])
@login_required
def update_list_title(list_id):
    try:
        # Retrieve the list that matches the list_id and current user's id
        list_to_update = List.query.filter_by(id=list_id, user_id=current_user.id).first()

        # If the list is not found, return an error
        if not list_to_update:
            return jsonify({"error": "List not found"}), 404

        # Get the updated title from the request data
        data = request.json
        list_to_update.name = data.get('name', list_to_update.name)

        # Commit the changes to the database
        db.session.commit()
        
        # Return a success response
        return jsonify({"message": "List title updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
