// server.js - Complete Server with Authentication
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const { authRouter } = require('./routes/auth');
const documentsRouter = require('./routes/documents');

// Import authentication module
const { authenticateToken, authorizeRoles } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MONGOOSE SAFETY CONFIG ===================== */
mongoose.set('bufferCommands', false);

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);

/* ===================== SCHEMAS & MODELS ===================== */

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  course: { type: String },
  semester: { type: Number },
  rollNumber: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String },
  guide: { type: String },
  status: { 
    type: String, 
    enum: ['planning', 'in-progress', 'completed', 'submitted'],
    default: 'planning'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  marks: { type: Number, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String },
  dueDate: { type: Date },
  totalMarks: { type: Number, default: 100 },
  semester: { type: Number },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String },
  submissionDate: { type: Date, default: Date.now },
  marksObtained: { type: Number },
  feedback: { type: String },
  status: {
    type: String,
    enum: ['submitted', 'pending', 'graded'],
    default: 'submitted'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);
const Project = mongoose.model('Project', projectSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const Submission = mongoose.model('Submission', submissionSchema);

/* ===================== ROUTES ===================== */

// Root route (public)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Capstone Project Backend API with Authentication',
    version: '2.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ===================== SERVER START (SAFE ORDER) ===================== */

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log('📦 Database:', mongoose.connection.name);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port 5000`);
      console.log(`🔐 Authentication enabled`);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

startServer();
