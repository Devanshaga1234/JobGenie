const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API working check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Register a new user
app.post('/users', (req, res) => {
  const { name, email, resume, preferences } = req.body;
  const query = `
    INSERT INTO \`User\` (Name, Email, Resume, Preferences)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [name, email, resume, preferences], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Failed to register user' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Fetch user by email
app.get('/users/:email', (req, res) => {
  const email = req.params.email;
  const query = `SELECT Name, Email, Resume, Preferences FROM \`User\` WHERE Email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Update resume by email
app.put('/users/:email', (req, res) => {
  const { resume } = req.body;
  const email = req.params.email;
  const query = `UPDATE \`User\` SET Resume = ? WHERE Email = ?`;

  db.query(query, [resume, email], (err, result) => {
    if (err) {
      console.error('Error updating resume:', err);
      return res.status(500).json({ error: 'Failed to update resume' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Resume updated successfully' });
  });
});

// Delete resume by email
app.delete('/users/:email', (req, res) => {
  const email = req.params.email;
  const query = `UPDATE \`User\` SET Resume = NULL WHERE Email = ?`;

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error deleting resume:', err);
      return res.status(500).json({ error: 'Failed to delete resume' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' });
  });
});

// Upload and parse resume from file
app.post('/upload-resume/:email', upload.single('resume'), async (req, res) => {
  const email = req.params.email;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const pdfText = await pdfParse(req.file.buffer);
    const resumeText = pdfText.text;

    const query = `UPDATE \`User\` SET Resume = ? WHERE Email = ?`;
    db.query(query, [resumeText, email], (err, result) => {
      if (err) {
        console.error('Error updating resume:', err);
        return res.status(500).json({ error: 'Failed to update resume' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'Resume uploaded and parsed successfully' });
    });

  } catch (err) {
    console.error('Error parsing PDF:', err);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

// // Recommended Jobs Route (Title matching only)
// app.get('/recommended-jobs/:email', (req, res) => {
//   const email = req.params.email;

//   // Fetch user's resume
//   const userQuery = `SELECT Resume FROM \`User\` WHERE Email = ?`;
//   db.query(userQuery, [email], (err, userResult) => {
//     if (err) {
//       console.error('Error fetching user resume:', err);
//       return res.status(500).json({ error: 'Failed to fetch user resume' });
//     }

//     if (userResult.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const resumeText = userResult[0].Resume;
//     if (!resumeText) {
//       return res.status(400).json({ error: 'User has not uploaded a resume yet' });
//     }

//     // Fetch all jobs
//     const jobQuery = `SELECT JobID, Title, Company, Location FROM \`Job\``;
//     db.query(jobQuery, (err, jobsResult) => {
//       if (err) {
//         console.error('Error fetching jobs:', err);
//         return res.status(500).json({ error: 'Failed to fetch jobs' });
//       }

//       // Match based only on Job Title
//       const recommendedJobs = jobsResult.map(job => {
//         let score = 0;
//         const resumeLower = resumeText.toLowerCase();
//         const titleWords = job.Title.toLowerCase().split(/\s+/);

//         titleWords.forEach(word => {
//           if (resumeLower.includes(word)) score += 2; // Titles weighted higher
//         });

//         return { ...job, score };
//       });

//       // Sort jobs by score descending and pick top 5
//       recommendedJobs.sort((a, b) => b.score - a.score);

//       res.status(200).json(recommendedJobs.slice(0, 5));
//     });
//   });
// });


const natural = require('natural');
const TfIdf = natural.TfIdf;

// (TF-IDF Matching)
app.get('/recommended-jobs/:email', (req, res) => {
  const email = req.params.email;

  // Fetch user's resume
  const userQuery = `SELECT Resume FROM \`User\` WHERE Email = ?`;
  db.query(userQuery, [email], (err, userResult) => {
    if (err) {
      console.error('Error fetching user resume:', err);
      return res.status(500).json({ error: 'Failed to fetch user resume' });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resumeText = userResult[0].Resume;
    if (!resumeText) {
      return res.status(400).json({ error: 'User has not uploaded a resume yet' });
    }

    // Fetch all jobs
    const jobQuery = `SELECT JobID, Title, Company, Location FROM \`Job\``;
    db.query(jobQuery, (err, jobsResult) => {
      if (err) {
        console.error('Error fetching jobs:', err);
        return res.status(500).json({ error: 'Failed to fetch jobs' });
      }


      const tfidf = new TfIdf();
      tfidf.addDocument(resumeText);

      const recommendedJobs = jobsResult.map(job => {
        const jobTitle = job.Title || '';
        let score = 0;
        tfidf.tfidfs(jobTitle, function(i, measure) {
          score += measure;
        });
        return { ...job, score };
      });
      recommendedJobs.sort((a, b) => b.score - a.score);
      res.status(200).json(recommendedJobs.slice(0, 10));
    });
  });
});


app.post('/apply', (req, res) => {
  const { email, jobId } = req.body;

  const userQuery = `SELECT UserID FROM \`User\` WHERE Email = ?`;
  db.query(userQuery, [email], (err, userResult) => {
    if (err || userResult.length === 0) {
      console.error('Error finding user:', err);
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult[0].UserID;

    const procedureCall = `CALL ApplyForJobProcedure(?, ?)`;
    db.query(procedureCall, [userId, jobId], (err, results) => {
      if (err) {
        console.error('Error executing stored procedure:', err);
        return res.status(500).json({ error: err.sqlMessage || 'Application failed' });
      }


      const finalOutput = results[results.length - 1][0]; 

      res.status(201).json({
        message: 'Application successful via stored procedure!',
        analytics: {
          mostAppliedToCompanyCount: finalOutput?.MostAppliedToCompanyCount || 0,
          mostPopularJobNearby: finalOutput?.PopularJobNearby || null
        } 
      });
    });
  });
});



app.get('/applied-jobs/:email', (req, res) => {
  const email = req.params.email;
  const query = `
    SELECT j.JobID, j.Title, j.Company, j.Location
    FROM \`Application\` a
    JOIN \`User\` u ON a.UserID = u.UserID
    JOIN \`Job\` j ON a.JobID = j.JobID
    WHERE u.Email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching applied jobs:', err);
      return res.status(500).json({ error: 'Failed to fetch applied jobs' });
    }

    res.status(200).json(results);
  });
});


// Start server
app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});
