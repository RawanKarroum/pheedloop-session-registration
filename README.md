Event Registration App
A simple event registration system where users can sign up for sessions.

🚀 Setup Instructions
Clone the repository

sh
Copy
Edit
git clone https://github.com/yourusername/event-registration.git  
cd event-registration
Backend (Django + PostgreSQL) Setup

Install dependencies:
sh
Copy
Edit
pip install -r requirements.txt
Configure PostgreSQL database in .env or settings.py.
Apply migrations:
sh
Copy
Edit
python manage.py migrate
Start the backend server:
sh
Copy
Edit
python manage.py runserver
Frontend (React) Setup

Navigate to the frontend directory:
sh
Copy
Edit
cd frontend
Install dependencies:
sh
Copy
Edit
npm install
Start the React app:
sh
Copy
Edit
npm start
📸 Screenshots
Insert screenshots for each section:

List of available sessions
![image](https://github.com/user-attachments/assets/af369666-ec41-4ff9-888c-cf1a8cd00a61)

List of people who registered
Each member’s session registrations
💡 Design Decisions
React for the frontend: Provides a dynamic UI for user interaction.
Django for the backend: Manages session storage and user registrations.
PostgreSQL as the database: Ensures structured data storage.
Session conflict detection: Warns users of overlapping sessions.
