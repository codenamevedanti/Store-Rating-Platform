# Store Rating Platform

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built as part of a FullStack Intern Coding Challenge.

## Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MySQL + Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)

## Features

### System Administrator
- Dashboard with total users, stores, and ratings count
- Add and manage users (Normal User, Admin, Store Owner)
- View and filter all stores and users
- View detailed user profiles

### Normal User
- Register and login
- Browse all registered stores
- Search stores by name and address
- Submit and update ratings (1–5 stars)
- Change password

### Store Owner
- Login and view store dashboard
- See all ratings submitted for their store
- View average store rating
- Change password

## Form Validations
- Name: 20–60 characters
- Address: Max 400 characters
- Password: 8–16 characters, at least 1 uppercase and 1 special character
- Email: Standard email format

## Project Structure

```
├── Backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & role-check middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── validations/    # Input validators
│   └── index.js        # Entry point
│
├── Frontend/
│   └── src/
│       ├── api/        # Axios configuration
│       ├── components/ # Reusable components
│       ├── context/    # Auth context
│       └── pages/      # All pages by role
```

## Screenshots

###  Login
<img width="1393" height="921" alt="image" src="https://github.com/user-attachments/assets/2464df53-6862-46e6-9150-32466e14dcc0" />


### Admin Dashboard
<img width="1895" height="926" alt="image" src="https://github.com/user-attachments/assets/33e8466f-3748-4ff7-a630-063d8b7c33a1" />


### User Ratings
<img width="1886" height="893" alt="image" src="https://github.com/user-attachments/assets/99193881-9aaf-4fe1-b930-f5b8e635f226" />








## Getting Started

### Prerequisites
- Node.js
- MySQL

### Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

Create the database in MySQL:
```sql
CREATE DATABASE my_dbname;
```

Run the server:
```bash
node index.js
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| PUT | /api/auth/change-password | Change password |
| GET | /api/users | Get all users (Admin) |
| POST | /api/users | Create user (Admin) |
| GET | /api/stores | Get all stores |
| POST | /api/stores | Create store (Admin) |
| POST | /api/ratings | Submit rating |
| PUT | /api/ratings/:id | Update rating |

## User Roles
| Role | Access |
|------|--------|
| admin | Full access - manage users, stores, view stats |
| user | Browse stores, submit/update ratings |
| store_owner | View own store ratings and average |
