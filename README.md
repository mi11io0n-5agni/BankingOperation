# COOPBank Queue Management System

A web-based queue and customer service management system designed to improve customer flow, reduce confusion in banking halls, and help employees manage service queues efficiently.

This project was developed as an academic Computer Science project based on observations during industrial practice at Cooperative Bank of Oromia, Seglen Eggu Branch. It is an independent demonstration project and is not an official COOPBank system.

## 📸 Application Screenshots

### 🏠 Home Page
The main interface introduces the system and provides access to customer queue services.

![COOPBank Queue Management System - Home Page](screenshots/home.png)

### 🎫 Customer Queue Registration / Kiosk
Customers can select a banking service and receive a queue ticket through the kiosk interface.

![Customer Queue Registration](screenshots/kiosk.png)

### 👨‍💼 Employee Dashboard
Authorized employees can view their assigned service queues and update customer queue statuses.

![Employee Dashboard](screenshots/employee-dashboard.png)

### 📊 Administrator Dashboard
Administrators can monitor queue activity, view service statistics, and manage employee accounts.

![Administrator Dashboard](screenshots/admin-dashboard.png)

## ✨ Key Features

- **Customer Queue Registration:** Generate queue tickets for selected banking services.
- **Self-Service Kiosk:** Provide a simple interface for customers to select services.
- **Staff-Assisted Registration:** Allow employees to register customers who need assistance.
- **Queue Status Tracking:** Check the status of a queue ticket.
- **Employee Authentication:** Secure employee access using login credentials.
- **Service-Based Queue Management:** Allow employees to manage queues assigned to their services.
- **Administrator Dashboard:** Monitor queue activity and manage employee accounts.
- **Queue Status Updates:** Track customers through Waiting, Serving, Completed, and Cancelled states.
- **Responsive Interface:** Provide an interface suitable for different screen sizes.

## 🏦 Supported Banking Services

The system supports six service categories:

1. Account Opening
2. Deposit
3. Withdrawal
4. Mobile Banking
5. Account Harmonization
6. Customer Support

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

## 🏗️ System Architecture

The application uses a client-server architecture:

1. The React frontend provides the customer, employee, and administrator interfaces.
2. The Express backend exposes REST API endpoints and handles queue-management operations.
3. MongoDB stores queue records and employee information.
4. JWT-based authentication protects employee and administrator endpoints.

## 🚀 Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js and npm
- A MongoDB database or MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone <https://github.com/mi11io0n-5agni/BankingOperation.git/>
cd BankingOperation
```

Replace `<https://github.com/mi11io0n-5agni/BankingOperation>` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
```

Replace the example values with your own private configuration. Never commit `.env` or publish database credentials.

### 3. Start the backend

```bash
npm start
```

If your `package.json` uses a different development script, use the script defined in that file.

The backend should run at `http://localhost:5000` by default.

### 4. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create or update `frontend/.env` for local development:

```env
VITE_API_URL=http://localhost:5000
```

For production, configure `VITE_API_URL` in your Vercel project settings to point to your deployed Render backend.

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Security Notes

- Employee and administrator access requires authentication.
- Passwords should be stored as hashes, not plaintext.
- Keep database credentials and JWT secrets private.
- Use dedicated demo accounts and fictional data for public demonstrations.
- Do not expose real customer information in screenshots or sample data.

## 📌 Project Scope

This system focuses on queue registration, customer flow, employee queue handling, and administrative monitoring.

It does **not** process real banking transactions, retrieve real account balances, verify real banking identities, or integrate with COOPBank's core banking infrastructure.

## 👨‍💻 Project Purpose

This project demonstrates the practical application of full-stack web development, REST API design, database integration, authentication, role-based access, and queue-management workflows.

It was created for academic and portfolio demonstration purposes.

## 📄 License

Add a license to this repository if you intend to distribute or reuse the project. Until a license is added, the repository is not automatically open for unrestricted reuse.
