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
- **backend**
  - **app.py**: The main entry point for the Flask application. Initializes and runs the server.
  - **auth.py**: Contains functions related to user authentication like login and signup.
  - **database.py**: Handles database creation.
  - **models.py**: Defines the database table models and their relationships using an ORM (SQLAlchemy).
  - **requirements.txt**: Lists all the Python dependencies needed to run the backend.
  - **routes.py**: Defines the API endpoints and their corresponding handlers for the application.

- **frontend**
  - **public**: Contains static files and assets that can be directly accessed by the browser.
  - **src**
    - **components**
      - **Header.js**: React component representing the header of the application.
      - **Login.js**: React component for the login form and its functionalities.
      - **Signup.js**: React component for the user registration form and related actions.
      - **ToDoItem.js**: React component representing individual todo items. Includes functions like editing tasks' titles and updating task status.
      - **ToDoList.js**: React component for showcasing a list of todo items.
    - **pages**
      - **LoginPage.js**: A page dedicated to user login.
      - **SignupPage.js**: A page dedicated to user registration.
      - **UserPage.js**: User's main dashboard/homepage displaying their todo lists and tasks. Includes functions like creating lists and tasks, deleting lists and tasks, moving tasks
        and updating lists' titles.
    - **App.js** The main React application component that brings together all pages and components.
    - **index.css**: contains directives for integrating Tailwind CSS styles into the application.
    - **index.js**: Entry point for the React application, responsible for rendering the root component.
    - **UserContext.js**: Context for managing and accessing user-related data across the application.
    - **package-lock.json**: Automatically generated file to lock down the versions of npm dependencies.
    - **package.json**: Lists project details, scripts, and npm dependencies.
    - **tailwind.config.js**: Configuration file for TailwindCSS to customize styles or plugins.
- **README.md**

## Demo video
Click on the following link to watch the video. 


## AI statement
ChatGPT has helped me tremendously in this assignment. It helped me create functions, routes, and models, guided me through the project, answered my questions, cleared my confusion for a lot of things, and debugged for me. However, there are times when it is not very useful and I had to either debug on my own or ask for help from other people. 








