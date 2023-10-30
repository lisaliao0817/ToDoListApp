from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import User, List, Task

api = Blueprint('api', __name__, url_prefix='/api/')


def get_current_user():
    email = get_jwt_identity()
    return User.query.filter_by(email=email).first()


# Get all lists for current user
@api.route('/list', methods=['GET'])
@jwt_required()
def get_lists():
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        user_lists = List.query.filter_by(user_id=user.id).all()
        return jsonify([list_item.serialize() for list_item in user_lists]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Create a new list
@api.route('/list', methods=['POST'])
@jwt_required()
def create_list():
    # Replaced current_user with get_current_user()
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        data = request.json
        new_list = List(name=data['name'], user_id=user.id)
        db.session.add(new_list)
        db.session.commit()
        return jsonify({"message": "List created successfully", "id": new_list.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/list/<int:list_id>', methods=['DELETE'])
@jwt_required()
def delete_list(list_id):
    user = get_current_user()
    try:
        list_to_delete = List.query.filter_by(id=list_id, user_id=user.id).first()
        if not list_to_delete:
            return jsonify({"error": "List not found"}), 404

        tasks_to_delete = Task.query.filter_by(list_id=list_id, user_id=user.id).all()
        for task in tasks_to_delete:
            db.session.delete(task)
            
        db.session.delete(list_to_delete)
        db.session.commit()
        return jsonify({"message": "List and associated tasks deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

@api.route('/list/<int:list_id>', methods=['PUT'])
@jwt_required()
def update_list_title(list_id):
    user = get_current_user()
    try:
        # Retrieve the list that matches the list_id and current user's id
        list_to_update = List.query.filter_by(id=list_id, user_id=user.id).first()

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
    

@api.route('/task/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user = get_current_user()
    try:
        task = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        data = request.json
        task.title = data.get('title', task.title)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify(task.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@api.route('/task/<int:task_id>/move/<int:new_list_id>', methods=['PUT'])
@jwt_required()
def move_task(task_id, new_list_id):
    user = get_current_user()
    try:
        task = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        new_list = List.query.filter_by(id=new_list_id, user_id=user.id).first()
        if not new_list:
            return jsonify({"error": "New list not found"}), 404
        
        task.list_id = new_list_id
        db.session.commit()
        return jsonify({"message": f"Task moved to list {new_list.name}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@api.route('/list/<int:list_id>/task', methods=['GET'])
@jwt_required()
def get_tasks(list_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        tasks_in_list = Task.query.filter_by(list_id=list_id, user_id=user.id, parent_id=None).all()
        return jsonify([task.serialize() for task in tasks_in_list]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Create a new task in a specific list or as a subtask to another task
@api.route('/list/<int:list_id>/task', methods=['POST'])
@jwt_required()
def create_task(list_id):
    user = get_current_user()
    try:
        data = request.json
        parent_id = data.get('parent_id', None)  # This is new, for subtask creation

        # Ensure parent task exists and belongs to the current user (For Subtasks)
        if parent_id:
            parent_task = Task.query.filter_by(id=parent_id, user_id=user.id).first()
            if not parent_task:
                return jsonify({"error": "Parent task not found"}), 404

        new_task = Task(title=data['title'], user_id=user.id, list_id=list_id, parent_id=parent_id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully", "id": new_task.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a task (This will handle tasks and subtasks)
@api.route('/task/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user = get_current_user()
    try:
        task_to_delete = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task_to_delete:
            return jsonify({"error": "Task not found"}), 404
        db.session.delete(task_to_delete)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get subtasks of a specific task
@api.route('/task/<int:task_id>/subtasks', methods=['GET'])
@jwt_required()
def get_subtasks(task_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        subtasks = Task.query.filter_by(parent_id=task_id, user_id=user.id).all()
        return jsonify([subtask.serialize() for subtask in subtasks]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @api.route('/task/<int:task_id>/subtask', methods=['GET'])
# @jwt_required()
# def get_subtasks(task_id):
#     user = get_current_user()
#     if not user:
#         return jsonify({"error": "User not authenticated"}), 401
#     try:
#         # Ensure the task belongs to the user first
#         task = Task.query.filter_by(id=task_id, user_id=user.id).first()
#         if not task:
#             return jsonify({"error": "Task not found"}), 404

#         subtasks_in_task = SubTask.query.filter_by(task_id=task_id).all()
#         return jsonify([subtask.serialize() for subtask in subtasks_in_task]), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



# @api.route('/subtask/<int:subtask_id>', methods=['PUT'])
# @jwt_required()
# def update_subtask(subtask_id):
#     user = get_current_user()
#     try:
#         subtask = SubTask.query.filter_by(id=subtask_id).join(Task).filter_by(user_id=user.id).first()
#         if not subtask:
#             return jsonify({"error": "Subtask not found"}), 404
#         data = request.json
#         subtask.title = data.get('title', subtask.title)
#         subtask.status = data.get('status', subtask.status)
#         db.session.commit()
#         return jsonify({
#             "id": subtask.id,
#             "title": subtask.title,
#             "status": subtask.status
#         }), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # Create a new task in a specific list
# @api.route('/list/<int:list_id>/task', methods=['POST'])
# @jwt_required()
# def create_task(list_id):
#     user = get_current_user()
#     try:
#         data = request.json
#         new_task = Task(title=data['title'], user_id=user.id, list_id=list_id)
#         db.session.add(new_task)
#         db.session.commit()
#         return jsonify({"message": "Task added successfully", "id": new_task.id}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Create a new subtask for a specific task
# @api.route('/task/<int:task_id>/subtask', methods=['POST'])
# @jwt_required()
# def create_subtask(task_id):
#     try:
#         data = request.json
#         new_subtask = SubTask(title=data['title'], task_id=task_id)
#         db.session.add(new_subtask)
#         db.session.commit()
#         return jsonify({"message": "Subtask added successfully", "id": new_subtask.id}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



# @api.route('/task/<int:task_id>', methods=['DELETE'])
# @jwt_required()
# def delete_task(task_id):
#     user = get_current_user()
#     try:
#         task_to_delete = Task.query.filter_by(id=task_id, user_id=user.id).first()
#         if not task_to_delete:
#             return jsonify({"error": "Task not found"}), 404
#         db.session.delete(task_to_delete)
#         db.session.commit()
#         return jsonify({"message": "Task deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @api.route('/subtask/<int:subtask_id>', methods=['DELETE'])
# @jwt_required()
# def delete_subtask(subtask_id):
#     user = get_current_user()
#     try:
#         subtask_to_delete = SubTask.query.filter_by(id=subtask_id).join(Task).filter_by(user_id=user.id).first()
#         if not subtask_to_delete:
#             return jsonify({"error": "Subtask not found"}), 404
#         db.session.delete(subtask_to_delete)
#         db.session.commit()
#         return jsonify({"message": "Subtask deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500