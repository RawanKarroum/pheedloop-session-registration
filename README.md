# 📅 Event Registration App

A simple event registration system where users can sign up for sessions.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/RawanKarroum/pheedloop-session-registration
cd pheedloop-session-registration
```

### 2️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 3️⃣ Configure PostgreSQL Database
- Ensure PostgreSQL is installed and running.
- Create a .env file in the backend directory and add your database credentials:
```sh
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
```

### 4️⃣ Apply Migrations
```sh
python manage.py migrate
```

### 5️⃣ Start the Backend Server
```sh
python manage.py runserver
```

### 🎨 Frontend (React) Setup
### 6️⃣ Navigate to the Frontend Directory
```sh
cd frontend
```

### 7️⃣ Install Dependencies
```sh
npm install
```

### 8️⃣ Start the React App
```sh
npm start
```

### 📸 Screenshots

9️⃣ List of Available Sessions
![image](https://github.com/user-attachments/assets/2ffd1bdb-c08b-417c-8275-570674a3240a)


🔟 List of People Who Registered & Each Member’s Session Registrations
![image](https://github.com/user-attachments/assets/82573974-3d2f-496d-ba05-921672903e55)


![image](https://github.com/user-attachments/assets/bc062eae-bf81-4980-81e6-11175761a5c3)



###💡 Design Decisions
React for the frontend – Provides a dynamic UI for user interaction.
Django for the backend – Manages session storage and user registrations.
PostgreSQL as the database – Ensures structured data storage.
Session conflict detection – Warns users of overlapping sessions.
.env file for local development – Keeps database credentials secure and configurable.


