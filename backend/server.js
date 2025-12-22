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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/capstone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {console.log('✅ MongoDB Connected Successfully');console.log("📦 Database:", mongoose.connection.name);})
.catch((err) => console.log('❌ MongoDB Connection Error:', err));

// ==================== SCHEMAS & MODELS ====================

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

// ==================== AUTHENTICATION ROUTES ====================
// Mount authentication routes (no authentication required for these)
app.use('/api/auth', authRouter);

// ==================== PROTECTED ROUTES ====================

// Root route (public)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Capstone Project Backend API with Authentication',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      projects: '/api/projects',
      assignments: '/api/assignments',
      submissions: '/api/submissions',
      statistics: '/api/statistics'
    }
  });
});

// ==================== STUDENT ENDPOINTS (Protected) ====================

// GET - Fetch all students (authenticated users only)
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const { course, semester, search } = req.query;
    let query = {};
    
    if (course) query.course = course;
    if (semester) query.semester = parseInt(semester);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// GET - Fetch single student (authenticated users)
app.get('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// POST - Create student (teacher/admin only)
app.post('/api/students', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { name, email, phone, course, semester, rollNumber } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { rollNumber: rollNumber }]
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }
    
    const student = await Student.create({
      userId: req.user.id,
      name,
      email,
      phone,
      course,
      semester,
      rollNumber
    });
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
});

// PUT - Update student (teacher/admin only)
app.put('/api/students/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { name, email, phone, course, semester, rollNumber } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        email, 
        phone, 
        course, 
        semester, 
        rollNumber,
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
});

// DELETE - Delete student (admin only)
app.delete('/api/students/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
});

// ==================== PROJECT ENDPOINTS (Protected) ====================

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { status, studentId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    
    const projects = await Project.find(query)
      .populate('studentId', 'name email rollNumber')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('studentId', 'name email rollNumber course');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, studentId, studentName, guide, status, startDate, endDate } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }
    
    const project = await Project.create({
      title,
      description,
      studentId,
      studentName,
      guide,
      status,
      startDate,
      endDate
    });
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
});

app.put('/api/projects/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
  try {
    const { title, description, studentId, studentName, guide, status, startDate, endDate, marks } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        studentId, 
        studentName, 
        guide, 
        status, 
        startDate, 
        endDate, 
        marks,
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
});

app.delete('/api/projects/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
});

// ==================== ASSIGNMENT & SUBMISSION ENDPOINTS ====================
// Similar pattern - all protected with authenticateToken
// Add other endpoints following the same pattern...

// ==================== STATISTICS ENDPOINT ====================

app.get('/api/statistics', authenticateToken, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalProjects,
        totalAssignments,
        totalSubmissions,
        projectsByStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port 5000`);
  console.log(`📍 API URL: http://localhost:5000`);
  console.log(`🔐 Authentication enabled`);
});