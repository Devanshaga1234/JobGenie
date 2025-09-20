// Cloudflare Worker for JobGenie API

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// CORS helper function
function addCorsHeaders(response) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Mock database for Cloudflare Workers (in-memory storage)
let mockUsers = [];
let mockJobs = [];
let mockApplications = [];

// Initialize with sample data
function initializeMockData() {
  if (mockUsers.length === 0) {
    mockUsers = [
      {
        UserID: 1,
        Name: "John Doe",
        Email: "john@example.com",
        Resume: "Software Engineer with 5 years experience in React and Node.js",
        Preferences: "Remote, Tech, San Francisco"
      }
    ];
    
    mockJobs = [
      {
        JobID: 1,
        Title: "Senior React Developer",
        Company: "Tech Corp",
        Location: "San Francisco, CA",
        Description: "Looking for an experienced React developer"
      },
      {
        JobID: 2,
        Title: "Full Stack Engineer",
        Company: "StartupXYZ",
        Location: "Remote",
        Description: "Full stack development with Node.js and React"
      }
    ];
  }
}

// Mock database connection
async function getDbConnection() {
  initializeMockData();
  
  return {
    query: async (sql, params = []) => {
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Handle different SQL operations
      if (sql.includes('SELECT') && sql.includes('User') && sql.includes('Email')) {
        const email = params[0];
        const user = mockUsers.find(u => u.Email === email);
        return user ? [user] : [];
      }
      
      if (sql.includes('INSERT INTO') && sql.includes('User')) {
        const newUser = {
          UserID: mockUsers.length + 1,
          Name: params[0],
          Email: params[1],
          Resume: params[2] || '',
          Preferences: params[3] || ''
        };
        mockUsers.push(newUser);
        return [{ insertId: newUser.UserID }];
      }
      
      if (sql.includes('UPDATE') && sql.includes('User') && sql.includes('Email')) {
        const email = params[1];
        const userIndex = mockUsers.findIndex(u => u.Email === email);
        if (userIndex !== -1) {
          mockUsers[userIndex].Resume = params[0];
          return [{ affectedRows: 1 }];
        }
        return [{ affectedRows: 0 }];
      }
      
      if (sql.includes('SELECT') && sql.includes('Job')) {
        return mockJobs;
      }
      
      if (sql.includes('INSERT INTO') && sql.includes('Application')) {
        const newApplication = {
          UserID: params[0],
          JobID: params[1],
          ApplicationDate: new Date().toISOString()
        };
        mockApplications.push(newApplication);
        return [{ insertId: mockApplications.length }];
      }
      
      if (sql.includes('SELECT') && sql.includes('Application')) {
        const email = params[0];
        const user = mockUsers.find(u => u.Email === email);
        if (user) {
          return mockApplications
            .filter(app => app.UserID === user.UserID)
            .map(app => {
              const job = mockJobs.find(j => j.JobID === app.JobID);
              return {
                JobID: job.JobID,
                Title: job.Title,
                Company: job.Company,
                Location: job.Location
              };
            });
        }
        return [];
      }
      
      // Default response
      return [];
    }
  };
}

// Helper function to parse request body
async function parseBody(request) {
  const contentType = request.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await request.json();
  }
  return null;
}

// Helper function to serve static files
async function serveStaticFile(path, env) {
  // Default to index.html for SPA routing
  if (path === '/' || path === '') {
    path = '/index.html';
  }
  
  try {
    // Serve the main React app
    if (path === '/index.html' || path === '/') {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="JobGenie - AI-Powered Job Recommendation System" />
    <title>JobGenie - AI-Powered Job Recommendations</title>
    <style>
      * { 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box; 
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: white;
        min-height: 100vh;
        overflow-x: hidden;
      }
      
      .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem 0;
        z-index: 1000;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .nav-logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: #6366f1;
      }
      
      .nav-links {
        display: flex;
        gap: 1rem;
      }
      
      .nav-links a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background 0.2s;
        font-size: 0.9rem;
      }
      
      .nav-links a:hover {
        background: rgba(99, 102, 241, 0.2);
      }
      
      .main-content {
        padding-top: 100px;
        min-height: 100vh;
      }
      
      .container { 
        max-width: 1200px; 
        margin: 0 auto; 
        padding: 2rem 1rem;
        text-align: center;
      }
      
      .hero-section {
        padding: 4rem 0;
      }
      
      .hero-logo { 
        width: 100px; 
        height: 100px; 
        margin: 0 auto 2rem; 
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
      }
      
      .hero-title { 
        font-size: 3.5rem; 
        font-weight: 800; 
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .hero-subtitle { 
        font-size: 1.3rem; 
        margin-bottom: 3rem; 
        color: #cbd5e1;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .btn { 
        display: inline-block;
        padding: 1rem 2rem; 
        margin: 0.5rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white; 
        text-decoration: none; 
        border-radius: 12px; 
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 1rem;
      }
      
      .btn:hover { 
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
      }
      
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 4rem 0;
        padding: 0 1rem;
      }
      
      .feature {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        transition: transform 0.3s ease;
      }
      
      .feature:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
      }
      
      .feature h3 {
        color: #6366f1;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
      
      .feature p {
        color: #cbd5e1;
        line-height: 1.6;
      }
      
      .api-status {
        margin-top: 3rem; 
        padding: 2rem; 
        background: rgba(255, 255, 255, 0.05); 
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .api-status h3 {
        color: #10b981; 
        margin-bottom: 1rem;
        font-size: 1.3rem;
      }
      
      .api-status code {
        background: rgba(255,255,255,0.1); 
        padding: 0.5rem; 
        border-radius: 8px;
        font-family: 'Courier New', monospace;
      }
      
      .api-status ul {
        text-align: left;
        margin-top: 1rem;
        list-style: none;
      }
      
      .api-status li {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }
      
      .form-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        text-align: left;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .form-container h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #6366f1;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #6366f1;
        font-weight: 600;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }
      
      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }
      
      .error {
        color: #f87171;
        margin-top: 0.5rem;
        font-size: 0.9rem;
      }
      
      .success {
        color: #10b981;
        margin-top: 0.5rem;
        font-size: 0.9rem;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .nav-content {
          flex-direction: column;
          gap: 1rem;
        }
        
        .nav-links {
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .hero-title {
          font-size: 2.5rem;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
        }
        
        .features {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .btn {
          display: block;
          width: 100%;
          margin: 0.5rem 0;
        }
        
        .main-content {
          padding-top: 120px;
        }
      }
      
      @media (max-width: 480px) {
        .container {
          padding: 1rem 0.5rem;
        }
        
        .form-container {
          padding: 1.5rem;
        }
        
        .hero-logo {
          width: 80px;
          height: 80px;
          font-size: 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <nav class="nav">
      <div class="nav-content">
        <div class="nav-logo">💼 JobGenie</div>
        <div class="nav-links">
          <a href="#" onclick="showHome()">Home</a>
          <a href="#" onclick="showSignup()">Sign Up</a>
          <a href="#" onclick="showUpload()">Upload Resume</a>
          <a href="#" onclick="showAPI()">API Status</a>
        </div>
      </div>
    </nav>

    <div class="main-content">
      <div id="home-page" class="container">
        <div class="hero-section">
          <div class="hero-logo">💼</div>
          <h1 class="hero-title">JobGenie</h1>
          <p class="hero-subtitle">Your AI-powered career companion. Upload your resume and let the magic begin.</p>
          
          <div>
            <button class="btn" onclick="showSignup()">Get Started</button>
            <button class="btn" onclick="showUpload()">Upload Resume</button>
          </div>
        </div>
        
        <div class="features">
          <div class="feature">
            <h3>🤖 AI-Powered Matching</h3>
            <p>Advanced algorithms match candidates with relevant job opportunities using TF-IDF and natural language processing.</p>
          </div>
          <div class="feature">
            <h3>📄 Resume Analysis</h3>
            <p>Upload and analyze resumes to extract skills, experience, and qualifications automatically.</p>
          </div>
          <div class="feature">
            <h3>⚡ Real-time API</h3>
            <p>Fast, serverless backend powered by Cloudflare Workers for global performance.</p>
          </div>
        </div>
      </div>

      <div id="signup-page" class="container" style="display: none;">
        <h1>Create Your Account</h1>
        <div class="form-container">
          <form id="signup-form" onsubmit="handleSignup(event)">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" required placeholder="John">
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" required placeholder="Doe">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="john.doe@email.com">
            </div>
            <div class="form-group">
              <label>Resume</label>
              <textarea name="resume" rows="4" placeholder="Paste your resume text here"></textarea>
            </div>
            <div class="form-group">
              <label>Preferences</label>
              <input type="text" name="preferences" placeholder="e.g. Remote, Finance, Bangalore">
            </div>
            <button type="submit" class="btn">Sign Up</button>
            <div id="signup-message"></div>
          </form>
        </div>
      </div>

      <div id="upload-page" class="container" style="display: none;">
        <h1>Upload Resume</h1>
        <div class="form-container">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="upload-email" required placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label>Resume File</label>
            <input type="file" id="resume-file" accept=".pdf,.doc,.docx" required>
          </div>
          <button class="btn" onclick="uploadResume()">Upload Resume</button>
          <div id="upload-message"></div>
        </div>
      </div>

      <div id="api-page" class="container" style="display: none;">
        <h1>API Status</h1>
        <div class="api-status">
          <h3>🚀 API Status: Online</h3>
          <p>Backend API is running at: <code>https://jobgenie-api.devansh-aga2510.workers.dev</code></p>
          <p style="margin-top: 1rem;">Available endpoints:</p>
          <ul style="text-align: left; margin-top: 1rem;">
            <li><code>POST /users</code> - User registration</li>
            <li><code>GET /users/:email</code> - Get user by email</li>
            <li><code>PUT /users/:email</code> - Update user resume</li>
            <li><code>POST /upload-resume/:email</code> - Upload resume file</li>
            <li><code>GET /recommended-jobs/:email</code> - Get job recommendations</li>
            <li><code>POST /apply</code> - Apply for jobs</li>
            <li><code>GET /applied-jobs/:email</code> - Get applied jobs</li>
          </ul>
        </div>
      </div>
    </div>

    <script>
      function showPage(pageId) {
        document.querySelectorAll('[id$="-page"]').forEach(page => {
          page.style.display = 'none';
        });
        document.getElementById(pageId).style.display = 'block';
      }

      function showHome() { showPage('home-page'); }
      function showSignup() { showPage('signup-page'); }
      function showUpload() { showPage('upload-page'); }
      function showAPI() { showPage('api-page'); }

      async function handleSignup(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
          name: formData.get('firstName') + ' ' + formData.get('lastName'),
          email: formData.get('email'),
          resume: formData.get('resume'),
          preferences: formData.get('preferences')
        };

        try {
          const response = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const result = await response.json();
          const messageDiv = document.getElementById('signup-message');
          
          if (response.ok) {
            messageDiv.innerHTML = '<div class="success">Successfully signed up!</div>';
            event.target.reset();
          } else {
            messageDiv.innerHTML = '<div class="error">Error: ' + result.error + '</div>';
          }
        } catch (error) {
          document.getElementById('signup-message').innerHTML = '<div class="error">Signup failed. Please try again.</div>';
        }
      }

      async function uploadResume() {
        const email = document.getElementById('upload-email').value;
        const file = document.getElementById('resume-file').files[0];
        
        if (!email || !file) {
          document.getElementById('upload-message').innerHTML = '<div class="error">Please fill in all fields.</div>';
          return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
          const response = await fetch(\`/upload-resume/\${email}\`, {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          const messageDiv = document.getElementById('upload-message');
          
          if (response.ok) {
            messageDiv.innerHTML = '<div class="success">Resume uploaded successfully!</div>';
          } else {
            messageDiv.innerHTML = '<div class="error">Error: ' + result.error + '</div>';
          }
        } catch (error) {
          document.getElementById('upload-message').innerHTML = '<div class="error">Upload failed. Please try again.</div>';
        }
      }
    </script>
  </body>
</html>`;
      
      return addCorsHeaders(new Response(htmlContent, {
        headers: { 'Content-Type': 'text/html' },
      }));
    }
    
    // For other static files, return a simple message
    return addCorsHeaders(new Response('Static file not found', { status: 404 }));
    
  } catch (error) {
    return addCorsHeaders(new Response('Error serving static file', { status: 500 }));
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // Handle API routes first
      if (path.startsWith('/users') || path.startsWith('/upload-resume') || path.startsWith('/recommended-jobs') || path.startsWith('/apply') || path.startsWith('/applied-jobs')) {
        // API routes will be handled below
      } else if (path === '/' && method === 'GET') {
        // Serve the main app for root path
        return await serveStaticFile('/index.html', env);
      } else if (method === 'GET') {
        // Serve static files for other GET requests
        return await serveStaticFile(path, env);
      }

      // Test endpoint
      if (path === '/api/test' && method === 'GET') {
        return addCorsHeaders(new Response(JSON.stringify({ 
          message: 'API is working!',
          timestamp: new Date().toISOString(),
          availableEndpoints: [
            'POST /users - User registration',
            'GET /users/:email - Get user by email',
            'PUT /users/:email - Update user resume',
            'POST /upload-resume/:email - Upload resume file',
            'GET /recommended-jobs/:email - Get job recommendations',
            'POST /apply - Apply for jobs',
            'GET /applied-jobs/:email - Get applied jobs'
          ]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }));
      }

      // User registration
      if (path === '/users' && method === 'POST') {
        console.log('User registration endpoint hit');
        
        const body = await parseBody(request);
        console.log('Request body:', body);
        
        if (!body) {
          console.log('No request body found');
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }));
        }

        const { name, email, resume, preferences } = body;
        console.log('Registration data:', { name, email, resume, preferences });
        
        if (!name || !email) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Name and email are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
        
        try {
          const db = await getDbConnection();
          console.log('Database connection established');
          
          // Check if user already exists
          const existingUsers = await db.query(
            'SELECT Email FROM User WHERE Email = ?',
            [email]
          );
          
          if (existingUsers.length > 0) {
            return addCorsHeaders(new Response(JSON.stringify({ error: 'User already exists with this email' }), {
              status: 409,
              headers: { 'Content-Type': 'application/json' },
            }));
          }
          
          const result = await db.query(
            'INSERT INTO User (Name, Email, Resume, Preferences) VALUES (?, ?, ?, ?)',
            [name, email, resume || '', preferences || '']
          );
          
          console.log('User registration successful:', result);
          
          return addCorsHeaders(new Response(JSON.stringify({ 
            message: 'User registered successfully',
            userId: result[0]?.insertId || 'unknown'
          }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          console.error('Registration error:', error);
          return addCorsHeaders(new Response(JSON.stringify({ 
            error: 'Failed to register user',
            details: error.message 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Get user by email
      if (path.startsWith('/users/') && method === 'GET') {
        const email = path.split('/')[2];
        const db = await getDbConnection();
        
        try {
          const results = await db.query(
            'SELECT Name, Email, Resume, Preferences FROM User WHERE Email = ?',
            [email]
          );
          
          if (results.length === 0) {
            return addCorsHeaders(new Response(JSON.stringify({ error: 'User not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }));
          }
          
          return addCorsHeaders(new Response(JSON.stringify(results[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Update user resume
      if (path.startsWith('/users/') && method === 'PUT') {
        const email = path.split('/')[2];
        const body = await parseBody(request);
        
        if (!body || !body.resume) {
          return new Response('Resume data required', { status: 400 });
        }

        const db = await getDbConnection();
        
        try {
          await db.query('UPDATE User SET Resume = ? WHERE Email = ?', [body.resume, email]);
          return addCorsHeaders(new Response(JSON.stringify({ message: 'Resume updated successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Failed to update resume' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Get recommended jobs
      if (path.startsWith('/recommended-jobs/') && method === 'GET') {
        const email = path.split('/')[2];
        const db = await getDbConnection();
        
        try {
          // Get user resume
          const userResults = await db.query('SELECT Resume FROM User WHERE Email = ?', [email]);
          
          if (userResults.length === 0) {
            return addCorsHeaders(new Response(JSON.stringify({ error: 'User not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }));
          }

          const resumeText = userResults[0].Resume;
          if (!resumeText) {
            return addCorsHeaders(new Response(JSON.stringify({ error: 'User has not uploaded a resume yet' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }));
          }

          // Get all jobs
          const jobs = await db.query('SELECT JobID, Title, Company, Location FROM Job');
          
          // Simple keyword matching (simplified version of TF-IDF)
          const recommendedJobs = jobs.map(job => {
            let score = 0;
            const resumeLower = resumeText.toLowerCase();
            const titleWords = job.Title.toLowerCase().split(/\s+/);
            
            titleWords.forEach(word => {
              if (resumeLower.includes(word)) score += 2;
            });
            
            return { ...job, score };
          });

          recommendedJobs.sort((a, b) => b.score - a.score);
          
          return addCorsHeaders(new Response(JSON.stringify(recommendedJobs.slice(0, 10)), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Failed to fetch recommended jobs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Apply for job
      if (path === '/apply' && method === 'POST') {
        const body = await parseBody(request);
        const { email, jobId } = body;
        
        const db = await getDbConnection();
        
        try {
          // Get user ID
          const userResults = await db.query('SELECT UserID FROM User WHERE Email = ?', [email]);
          
          if (userResults.length === 0) {
            return addCorsHeaders(new Response(JSON.stringify({ error: 'User not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }));
          }

          const userId = userResults[0].UserID;
          
          // Apply for job (simplified version)
          await db.query('INSERT INTO Application (UserID, JobID, ApplicationDate) VALUES (?, ?, ?)', 
            [userId, jobId, new Date().toISOString()]);
          
          return addCorsHeaders(new Response(JSON.stringify({ message: 'Application successful!' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Application failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Get applied jobs
      if (path.startsWith('/applied-jobs/') && method === 'GET') {
        const email = path.split('/')[2];
        const db = await getDbConnection();
        
        try {
          const results = await db.query(`
            SELECT j.JobID, j.Title, j.Company, j.Location
            FROM Application a
            JOIN User u ON a.UserID = u.UserID
            JOIN Job j ON a.JobID = j.JobID
            WHERE u.Email = ?
          `, [email]);
          
          return addCorsHeaders(new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (error) {
          return addCorsHeaders(new Response(JSON.stringify({ error: 'Failed to fetch applied jobs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      }

      // Handle preflight requests
      if (method === 'OPTIONS') {
        return addCorsHeaders(new Response(null, { status: 200 }));
      }

      // 404 for unmatched API routes
      if (method !== 'GET') {
        return addCorsHeaders(new Response(JSON.stringify({ 
          error: 'API endpoint not found',
          availableEndpoints: [
            'POST /users - User registration',
            'GET /users/:email - Get user by email',
            'PUT /users/:email - Update user resume',
            'POST /upload-resume/:email - Upload resume file',
            'GET /recommended-jobs/:email - Get job recommendations',
            'POST /apply - Apply for jobs',
            'GET /applied-jobs/:email - Get applied jobs'
          ]
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }));
      }
      
      // For GET requests that don't match static files, serve the main app
      return await serveStaticFile('/index.html', env);

    } catch (error) {
      console.error('Worker error:', error);
      return addCorsHeaders(new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
  },
};
