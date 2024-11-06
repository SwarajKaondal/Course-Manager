# Team

1. Swaraj Kaondal: skaonda
2. Utsav Lal : ualal
3. Diksha Maurya : dmaurya
4. Vaibhavi Shetty : vshetty2

# Course-Manager

**CourseManager** is a learning management system that streamlines online course creation, organization, and student progress tracking.

## Database setup
Run all scripts in the db/ folder in MySQL Workbench. Start with create_table, Insert_data and then rest all the other scripts.
1. Run the create_schema.sql under backend/db/final
2. Run the insert_data.sql under backend/db/final

## Run Backend
**Python version**: 3.12

1. Create venv:
`python -m venv "venvzybook"`

2. activate venv: `venvzybooks/Scripts/activate`

3. Go to Backend app folder:
`cd backend/app`

4. Install requirements in venv: `pip install -r .\requirements.txt`

5. Run the backend app: `flask --app app run`

## Run Frontend

1. Go to Frontend app folder:
`cd frontend/`

2. Run the frontend app:
`npm install`
`npm start`

3. Go to http://localhost:3000/
