# ToDoListApp

## Introduction 
This is a a web application that allows users to create hierarchical todo lists. 
The application allows users to create multiple lists, and each list is able to contain multiple items. 
Each item is able to contain multiple sub-items, and so on, until the third level tasks. 
The user is able to create, edit, and delete lists and items. 
The user can also move items between lists, as well as expand and collapse a task that has subtasks.

## Installation

To get the application to run, follow the steps below:

**Flask on macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 app.py
```

**Flask on Windows:**

```bash
python3 -m venv venv
venv\Scripts\activate.bat
pip3 install -r requirements.txt
python3 app.py
```

**Node.js:**

```bash
npm install
npm start
```

## Features
### Sign up and log in
Allow users to register for an account and log into the application to access and manage their personal todo lists.

### Create lists
Enable users to generate multiple individual todo lists by clicking the 'Add a new list' button.

### Edit lists' titles
Offer users the flexibility to modify the names or titles of their previously created lists. The user can edit lists' titles by clicking the pencil icon beside the list title.

### Delete lists
Provide an option for users to remove any list they no longer require or deem irrelevant. The user can delete lists by clicking the trash icon beside the list title.

### Create tasks and subtasks
Facilitate the addition of primary tasks and their subsequent subtasks within a particular list, allowing for layered task organization (up to three levels). The user can create tasks by
clicking the plus icon either at the bottom of the list for top-level tasks or beside the task title for subtasks.

### Edit tasks' titles
Equip users with the capability to alter the titles of their tasks and subtasks. The user can edit tasks' titles by clicking the pencil icon beside the task title.

### Update tasks' status
Allow users to mark tasks as complete or pending, aiding in tracking their progress. The user can update the task status by checking the box beside the task title.

### Delete tasks
Enable users to eliminate specific tasks or subtasks that have either been completed or are no longer necessary. The user can delete tasks by clicking the trash icon beside the list title.

### Move tasks between lists
Allow users to reorganize and shift tasks from one list to another, optimizing task prioritization and management. The user can achieve this by dragging and dropping.

### Expand and collapse tasks
Allow users to view or hide subtasks linked to a main task, ensuring a clutter-free visual interface and focused task management. The user can achieve this by clicking the arrow icon beside a
task's checkbox.

## Codebase Overview
- backend
  - app.py
  - auth.py
  - database.py
  - models.py
  - requirements.txt
  - routes.py
- frontend
  - dist
    - output.css
  - public
  - src
    - components
      - Header.js
      - Login.js
      - Signup.js
      - ToDoItem.js
      - ToDoList.js
    - pages
      - LoginPage.js
      - SignupPage.js
      - UserPage.js
    - App.js
    - index.css
    - index.js
    - UserContext.js
    - package-lock.json
    - package.json
    - tailwind.config.js
- README.md









