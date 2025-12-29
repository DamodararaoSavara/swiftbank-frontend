# 🏦 SwiftBank Frontend

SwiftBank Frontend is a modern, responsive web application built using React (Vite) that serves as the client interface for the SwiftBank digital banking system. It integrates seamlessly with a secure Spring Boot backend and provides a smooth user experience for authentication and banking operations.

## 🚀 Features

   🔐 Secure login with JWT + OTP authentication

   📲 OTP verification and resend flow

    💳 Fund transfer between accounts

    📄 Transaction history view

    👤 Account profile management

    ⚠️ Automatic session expiry handling

    🔔 User-friendly notifications using Toast messages

    🌐 Environment-based API configuration

## 🛠 Tech Stack

    • React (Vite)

    • Axios (API communication)

    • React Router

    • React Toastify

    • HTML5 / CSS3 / JavaScript (ES6+)

🔗 Backend Integration

    ° This frontend connects to the SwiftBank Backend, which provides:

    ° JWT-based authentication

    ° OTP verification via SMS

    ° Secure banking APIs

 ## 📁 Project Structure
swiftbank-frontend/
├── src/
│   ├── api/            # Axios configuration & interceptors
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── routes/         # Route definitions
│   └── main.jsx
├── public/
├── .env
├── .index.html
├── .gitignore
├── package.json
└── README.md  

## ▶️ Running the Project Locally
   1️⃣ Install dependencies
       npm install

   2️⃣ Start development server
       npm run dev

The application will run at:
       http://localhost:5173

## 🔐 Security Practices

    • API base URL managed using environment variables

    • JWT stored in browser storage and attached via Axios interceptors

    • Automatic logout and redirection on token expiry

    • No secrets committed to the repository

## 🎯 Real-World Relevance

    • This frontend demonstrates:

    • Secure API consumption

    • Environment-based configuration

    • Session handling in client-side applications

    • Clean separation between frontend and backend

    • It is designed to follow industry best practices used in real-world fintech and enterprise applications.
    
## 📌 Future Enhancements

    • Role-based UI rendering

    • Improved UI/UX with design libraries

    • Deployment using Netlify or Vercel

    • Enhanced error handling and loading states

## 📜 License

This project is for learning and demonstration purposes.

## 👨‍💻 Author

### *Damodararao Savara*
