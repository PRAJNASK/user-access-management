# User Access Management System

## Description

This is a full-stack User Access Management System designed to allow employees to request access to software, managers to approve or reject these requests, and admins to manage the software list. The system features role-based access control and JWT authentication.

## Features

*   **User Roles:** Admin, Manager, Employee.
*   **Authentication:** User registration, login, and JWT-based session management.
*   **Admin Dashboard:**
    *   View all users.
    *   List all software.
    *   Add new software.
*   **Manager Dashboard:**
    *   View pending software access requests.
    *   Approve or reject requests.
*   **Employee Dashboard:**
    *   View available software.
    *   Request access to software.
    *   View the status of their requests.
*   **Protected Routes:** Access to different parts of the application is restricted based on user roles.

## Tech Stack

**Backend:**
*   Node.js
*   Express.js
*   TypeScript
*   TypeORM
*   PostgreSQL
*   JSON Web Tokens (JWT) for authentication

**Frontend:**
*   React
*   Vite
*   TypeScript
*   React Router
*   Axios (for API calls)

**Development:**
*   `concurrently` for running backend and frontend simultaneously.

## Project Structure
Admin Login : Admin
              Admin@123

Employee Login : Employee
                 Employe@123

Manager Login : Manager
                Manager@123