# 📝 Notes App (MERN Stack)

A full-stack Notes Application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. Users can securely register, log in, and manage their personal notes with full CRUD functionality.

## 🚀 Features

* User Authentication (Signup & Login)
* JWT Authentication
* Google Login Integration
* Create Notes
* Edit Notes
* Delete Notes
* Search Notes
* Responsive User Interface
* Secure Password Hashing with bcrypt
* RESTful API Architecture

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* Google OAuth

---

## 📁 Project Structure
Notes App/
│
├── notes app/          # Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/            # Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
```

---

### Frontend Setup

```bash
cd "notes app"
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register User |
| POST   | `/api/auth/login`  | Login User    |
| POST   | `/api/auth/google` | Google Login  |

### Notes

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/api/notes`     | Get All Notes |
| POST   | `/api/notes`     | Create Note   |
| PUT    | `/api/notes/:id` | Update Note   |
| DELETE | `/api/notes/:id` | Delete Note   |

---

## 🔒 Authentication

* JWT-based Authentication
* Protected Routes
* Password Hashing using bcryptjs
* Google OAuth Login Support

---


## 👩‍💻 Author

**Aleeza Amjad**

GitHub: https://github.com/aleeza-dev

LinkedIn: *https://pk.linkedin.com/in/aleeza-amjad-544379264*

---

## 📄 License

This project is developed for learning, portfolio, and educational purposes.
