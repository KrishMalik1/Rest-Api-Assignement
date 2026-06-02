 TaskFlow API

TaskFlow is a full-stack task management application built as part of a backend development assignment. The project focuses on secure authentication, role-based access control, and scalable API design. Users can register, log in, and manage their tasks, while administrators have additional privileges for managing users and monitoring application activity.

 Tech Stack

 Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

 Authentication & Security

- JWT Authentication
- bcryptjs
- Helmet
- Express Rate Limit
- express-mongo-sanitize

 Frontend

- React.js
- React Router
- Axios

 Documentation

- Swagger (OpenAPI)

---

 Project Structure

The application follows a modular architecture to keep the codebase organized and easy to scale.

- --Controllers-- handle business logic
- --Routes-- define API endpoints
- --Middleware-- manages authentication, authorization, and error handling
- --Models-- define database schemas
- --Validators-- ensure incoming requests are valid
- --Utilities-- contain reusable helper functions

This structure makes it easier to add new modules and features in the future.

---

 Getting Started

 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update the `.env` file with your MongoDB connection string and JWT secrets before starting the server.

The backend runs on:

http://localhost:5001

Swagger documentation:

http://localhost:5001/api-docs

 Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs on:

http://localhost:3000

---

 Features

 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- User profile endpoint

 Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Filter and paginate task data

 Admin Features

- View all users
- Update user roles
- Manage user status
- View application statistics

---

 Security Measures

Security was an important consideration while building this project.

- Passwords are hashed using bcryptjs before storage.
- JWT tokens are used to secure protected routes.
- Request validation is implemented using express-validator.
- Helmet is used to secure HTTP headers.
- Rate limiting helps prevent abuse of authentication endpoints.
- MongoDB sanitization is applied to reduce the risk of NoSQL injection attacks.
- Users can only access and manage their own tasks unless they have admin privileges.

---

 Database Design

 User Collection

Stores account information, authentication details, and user roles.

Fields include:

- Name
- Email
- Password (hashed)
- Role
- Active status
- Refresh token
- Timestamps

 Task Collection

Stores task-related information for each user.

Fields include:

- Title
- Description
- Status
- Priority
- Due date
- Owner reference
- Timestamps

---

 API Documentation

Interactive API documentation is available through Swagger and can be accessed at:

`/api-docs`

This allows all endpoints to be tested directly from the browser.

---

 Scalability Considerations

The application is designed with scalability in mind. A modular project structure allows new features to be added with minimal changes to existing code. Authentication is stateless through JWTs, making horizontal scaling easier. Future improvements could include Redis caching, Docker containerization, load balancing, and splitting services into independent microservices as the application grows.
