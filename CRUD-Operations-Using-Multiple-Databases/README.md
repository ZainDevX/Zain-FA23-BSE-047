# Multi-DB CRUD Application

A full-stack **Node.js + Express** web application that performs **CRUD (Create, Read, Update, Delete)** operations on three different databases simultaneously:

| Database  | Driver / ORM      | Type                  |
|-----------|--------------------|-----------------------|
| MongoDB   | Mongoose           | NoSQL (Document)      |
| MySQL     | mysql2 (Promise)   | Relational (SQL)      |
| SQLite    | better-sqlite3     | File-based (SQL)      |

---

## Project Structure

```
multi-db-crud/
├── config/
│   ├── mongodb.js          # MongoDB connection + Mongoose schema
│   ├── mysql.js             # MySQL pool + table creation
│   └── sqlite.js            # SQLite connection + table creation
├── routes/
│   ├── mongoRoutes.js       # MongoDB CRUD API routes
│   ├── mysqlRoutes.js       # MySQL CRUD API routes
│   └── sqliteRoutes.js      # SQLite CRUD API routes
├── public/
│   ├── css/
│   │   └── style.css        # Professional stylesheet
│   ├── js/
│   │   ├── mongo.js         # MongoDB frontend logic
│   │   ├── mysql.js         # MySQL frontend logic
│   │   └── sqlite.js        # SQLite frontend logic
│   ├── index.html           # Home / Landing page
│   ├── mongo.html           # MongoDB CRUD page
│   ├── mysql.html           # MySQL CRUD page
│   └── sqlite.html          # SQLite CRUD page
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js                # Main Express server entry point
└── README.md                # This file
```

---

## Prerequisites

Make sure you have the following installed on your system:

| Software   | Version  | Download Link                                      |
|------------|----------|----------------------------------------------------|
| **Node.js** | v16+    | https://nodejs.org/                                |
| **MongoDB** | v5+     | https://www.mongodb.com/try/download/community     |
| **MySQL**   | v8+     | https://dev.mysql.com/downloads/mysql/             |

> **SQLite** does not require any separate installation — the `better-sqlite3` package handles it automatically via a file (`database.sqlite`).

---

## Step-by-Step Setup Guide

### Step 1 — Clone / Open the Project

Open a terminal and navigate to the project folder:

```bash
cd "CRUD operating using Multiple Database"
```

### Step 2 — Install Dependencies

```bash
npm install
```

This installs: `express`, `cors`, `dotenv`, `mongoose`, `mysql2`, `better-sqlite3`, and `nodemon`.

### Step 3 — Start MongoDB

Open a **new terminal** and start the MongoDB server:

- **Windows:** MongoDB usually runs as a service. If not:
  ```bash
  mongod
  ```
- **macOS/Linux:**
  ```bash
  sudo systemctl start mongod
  ```

Verify it's running by opening another terminal and typing:
```bash
mongosh
```

### Step 4 — Create the MySQL Database

Open the MySQL CLI or any GUI tool (MySQL Workbench, phpMyAdmin, etc.):

```sql
CREATE DATABASE multi_db_crud;
```

> The app will automatically create the `users` table when it starts.

### Step 5 — Configure Environment Variables

Open the `.env` file and update the values if your setup differs:

```env
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/multi_db_crud

# MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=multi_db_crud
```

> **Important:** Replace `MYSQL_PASSWORD` with your actual MySQL root password. If you have no password, leave it empty.

### Step 6 — Start the Server

```bash
npm start
```

You should see:

```
✅ MongoDB Connected Successfully
✅ MySQL Connected & Table Ready
✅ SQLite Connected & Table Ready

🚀 Server running at http://localhost:3000
📁 MongoDB CRUD  → http://localhost:3000/mongo.html
📁 MySQL CRUD    → http://localhost:3000/mysql.html
📁 SQLite CRUD   → http://localhost:3000/sqlite.html
```

### Step 7 — Open in Browser

Visit **http://localhost:3000** in your browser. You'll see the home page with cards linking to each database's CRUD interface.

---

## API Endpoints

All three databases follow the same REST API pattern:

| Method   | Endpoint                       | Description        |
|----------|--------------------------------|--------------------|
| `GET`    | `/api/{db}/users`              | Get all users      |
| `GET`    | `/api/{db}/users/:id`          | Get a single user  |
| `POST`   | `/api/{db}/users`              | Create a new user  |
| `PUT`    | `/api/{db}/users/:id`          | Update a user      |
| `DELETE` | `/api/{db}/users/:id`          | Delete a user      |

Where `{db}` is one of: `mongo`, `mysql`, `sqlite`

### Example — Create a User (cURL)

```bash
curl -X POST http://localhost:3000/api/mongo/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "phone": "9876543210"}'
```

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Databases:** MongoDB, MySQL, SQLite
- **Libraries:** Mongoose, mysql2, better-sqlite3, dotenv, cors

---

## Troubleshooting

| Issue                          | Solution                                                      |
|--------------------------------|---------------------------------------------------------------|
| MongoDB connection failed      | Ensure `mongod` is running on port 27017                     |
| MySQL access denied            | Check `MYSQL_USER` and `MYSQL_PASSWORD` in `.env`            |
| MySQL database not found       | Run `CREATE DATABASE multi_db_crud;` in MySQL CLI            |
| `better-sqlite3` build error   | Install build tools: `npm install --global windows-build-tools` (Windows) |
| Port already in use            | Change `PORT` in `.env` or kill the process using port 3000  |

---

## License

ISC
