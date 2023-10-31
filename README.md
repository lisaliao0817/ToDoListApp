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
