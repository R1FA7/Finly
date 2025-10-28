# Finly 

Finly is a full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing personal finances. It allows users to track income and expenses, view real-time financial analytics, and manage their account with secure authentication and authorization features.

🚀 **[Live Site](https://finly-frontend.onrender.com)**

---

## ✨ Features

- 🔐 JWT-based authentication with access & refresh tokens  
- ✅ Email verification via OTP  
- 🔁 Password reset via email OTP
- 👥 RBAC(Role-Based Access Control) authorization
- 🤖 AI-powered RAG chatbot for instant FAQ assistance
- 📊 Interactive dashboard with real-time analytics  
- 📅 Weekly, monthly, and yearly breakdowns  
- 📁 Export transaction data to Excel  
- 🔍 Advanced search and filtering  
- 📈 Dynamic charts and visualizations  
- 🧠 Global state management with React Context API  
- ⚙️ Modular and validated RESTful APIs  
- 🎨 Dark/Light theme support
- 🔔 Set income/expense goal and notified when exceeded 
---

## 🛠️ Tech Stack

**Frontend**
- React.js
- TailwindCSS
- Chart.js
- Context API
- Yup (form validation)

**Backend**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (Access + Refresh tokens)
- Nodemailer (for OTP emails)
- Yup (backend validation)

**AI/ML**
- Groq API (LLM for chatbot)
- HuggingFace Embeddings (semantic search)
- LangChain (RAG pipeline)
- Vector similarity search

  
**Other Tools**
- Railway (deployment)
- xlsx (Excel export)

---

## 🔐 Authentication Flow

- Users register with email & password  
- Verification OTP is sent via email  
- JWT tokens (access & refresh) are used for session management  
- Password reset is handled via OTP email verification  
- All protected routes are guarded with middleware  

---

### **Transaction Management**
- Add, update, delete income and expense transactions
- Normalize and validate transaction data for consistency
- Advanced filtering and searching by type, source, amount, and date

### **Interactive Dashboard**
- Real-time financial analytics with breakdowns by week, month, and year
- Dynamic charts to visualize income vs expenses
- Recent transaction summaries with quick insights
- Category-wise and source-wise spending analysis

### **AI Chatbot Assistant** 🤖
- RAG-powered intelligent FAQ system
- Semantic search for accurate answers
- Contextual responses about Finly features
- Real-time chat interface with typing indicators

### **Goal Tracking**
- Set financial savings goals with deadlines
- Track progress with visual indicators
- Calculate daily/weekly/monthly saving requirements

### **Data Export & Reporting**
- Download transaction details as Excel (.xlsx) files for offline analysis
- Generate custom reports with date range filters

### **Admin Panel**
- User management and analytics
- System-wide announcements
- Role-based access control
---

## 🧪 Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/R1FA7/finly.git
cd finly
```

### 2. Setup backend

```bash
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI, JWT secrets, and email credentials
npm run dev
```

### 3. Setup frontend

```bash
cd ../frontend
npm install
npm run dev
```

> Make sure both frontend and backend run on separate ports and are connected via proxy.

---

## 📨 Environment Variables

**`.env` example:**

```env
MONGODB_URI
JWT_SECRET
JWT_REFRESH_SECRET
NODE_ENV
SMTP_USER
SMTP_PASS
SENDER_EMAIL
VITE_BACKEND_URL = 'http://localhost:3000'

# AI Chatbot (FREE APIs)
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_token
```

---

## 🧑‍💻 Author

- **Md Minhazul Kabir Rifat**
- [GitHub](https://github.com/R1FA7)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
