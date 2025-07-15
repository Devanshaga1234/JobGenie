# 💼 JobGenie - AI-Powered Job Recommendation System

[![GitHub](https://img.shields.io/github/license/AaryanGusain/Job_Genie)](https://github.com/AaryanGusain/Job_Genie/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)

An intelligent job recommendation and notification system that uses AI to match candidates with their ideal job opportunities. JobGenie combines advanced SQL querying, machine learning algorithms, and a modern web interface to revolutionize the job search experience.

## 🌟 Features

- **AI-Powered Job Matching**: Advanced algorithms to match candidates with relevant job opportunities
- **Resume Analysis**: Upload and analyze resumes to extract skills and experience
- **Real-time Notifications**: Get instant notifications for new job matches
- **Interactive Dashboard**: Modern React-based interface for easy navigation
- **Advanced Filtering**: Search and filter jobs based on multiple criteria
- **Application Tracking**: Keep track of applied jobs and their status
- **Cloud-Ready**: Built for deployment on Google Cloud Platform

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library

### Backend
- **Node.js & Express** - Server-side JavaScript runtime and framework
- **Python** - Data processing and machine learning
- **MySQL** - Primary database (Google Cloud SQL)
- **Natural.js** - Natural language processing

### Infrastructure
- **Google Cloud Platform** - Cloud hosting and services
- **MySQL on GCP** - Managed database service

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **MySQL** (local) or **Google Cloud SQL** (production)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AaryanGusain/Job_Genie.git
cd Job_Genie
```

### 2. Backend Setup

#### Python Environment Setup

```bash
# Navigate to backend directory
cd JobGenie_backend/JobGenie

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r ../../requirements.txt
```

#### Node.js Backend Setup

```bash
# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../../job-genie-frontend

# Install dependencies
npm install
```

### 4. Database Setup

```bash
# Navigate back to backend
cd ../JobGenie_backend/JobGenie

# Create database tables
python create_tables.py

# Insert sample data (optional)
python insertdata.py
```

### 5. Environment Configuration

Create a `.env` file in the `JobGenie_backend/JobGenie` directory:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306

# Application Configuration
NODE_ENV=development
PORT=5000
```

### 6. Running the Application

#### Start the Backend Services

```bash
# Terminal 1: Start Node.js server
cd JobGenie_backend/JobGenie
npm start

# Terminal 2: Start Python services (if needed)
python main.py
```

#### Start the Frontend

```bash
# Terminal 3: Start React development server
cd job-genie-frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
Job_Genie/
├── JobGenie_backend/
│   └── JobGenie/
│       ├── connect_db.py         # Database connection utilities
│       ├── create_tables.py      # Database schema creation
│       ├── insertdata.py         # Sample data insertion
│       ├── main.py              # Python main application
│       ├── server.js            # Node.js Express server
│       ├── package.json         # Node.js dependencies
│       └── README.md            # Backend-specific documentation
├── job-genie-frontend/
│   ├── public/
│   │   └── index.html          # Main HTML template
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AboutUs.jsx
│   │   │   ├── AppliedJobs.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobMatches.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   └── ViewResume.jsx
│   │   ├── App.js              # Main React component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
├── requirements.txt            # Python dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔧 API Endpoints

### Job Management
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs/search` - Search jobs with filters

### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile

### Resume Management
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/analysis` - Get resume analysis
- `POST /api/resume/match` - Get job matches for resume

## 🎯 Key Features Explained

### Resume Upload & Analysis
- Upload PDF/Word documents
- Extract skills, experience, and qualifications
- Generate compatibility scores with job postings

### AI Job Matching
- Natural language processing for job descriptions
- Skill-based matching algorithms
- Experience level compatibility analysis

### Advanced Search & Filtering
- Location-based filtering
- Salary range filtering
- Industry and role-specific searches
- Experience level matching

## 🚀 Deployment

### Local Development
Follow the Quick Start guide above for local development setup.

### Production Deployment (Google Cloud Platform)

1. **Database Setup**:
   - Create a Cloud SQL MySQL instance
   - Configure networking and security settings
   - Update connection strings in environment variables

2. **Backend Deployment**:
   - Deploy to Google App Engine or Compute Engine
   - Configure environment variables
   - Set up Cloud Build for CI/CD

3. **Frontend Deployment**:
   - Build the React application: `npm run build`
   - Deploy to Google Cloud Storage + CDN
   - Configure domain and SSL certificates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Large file uploads may timeout on slower connections
- Resume parsing accuracy varies with document format
- Search performance may be slower with large datasets

## 🔮 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Advanced ML models for better job matching
- [ ] Integration with LinkedIn and other job boards
- [ ] Real-time chat between recruiters and candidates
- [ ] Video interview scheduling
- [ ] Salary prediction algorithms

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/AaryanGusain/Job_Genie/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 👥 Team

- **Aaryan Gusain** - [@AaryanGusain](https://github.com/AaryanGusain)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
- Inspired by the need to make job searching more intelligent and efficient

---

⭐ If you find this project helpful, please give it a star on GitHub!
