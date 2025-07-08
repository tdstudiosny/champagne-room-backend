const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../file-storage/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow all file types for Tyler's personal use
    cb(null, true);
  }
});

// Upload file endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileInfo = {
      id: uuidv4(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date().toISOString(),
      category: req.body.category || 'general',
      tags: req.body.tags ? req.body.tags.split(',') : []
    };
    
    // Store file metadata (in production, this would be in a database)
    const metadataPath = path.join(__dirname, '../../file-storage/metadata.json');
    let metadata = [];
    
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
    
    metadata.push(fileInfo);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get all files endpoint
router.get('/list', (req, res) => {
  try {
    const metadataPath = path.join(__dirname, '../../file-storage/metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      return res.json({ files: [] });
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    res.json({ files: metadata });
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to list files', error: error.message });
  }
});

// Download file endpoint
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../file-storage/uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(filePath);
    
  } catch (error) {
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// Delete file endpoint
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../file-storage/uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Remove file
    fs.unlinkSync(filePath);
    
    // Update metadata
    const metadataPath = path.join(__dirname, '../../file-storage/metadata.json');
    if (fs.existsSync(metadataPath)) {
      let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      metadata = metadata.filter(file => file.filename !== filename);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
    
    res.json({ message: 'File deleted successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Secure file storage for .env files
router.post('/secure-upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const secureDir = path.join(__dirname, '../../file-storage/secure');
    if (!fs.existsSync(secureDir)) {
      fs.mkdirSync(secureDir, { recursive: true });
    }
    
    // Move file to secure directory
    const securePath = path.join(secureDir, req.file.filename);
    fs.renameSync(req.file.path, securePath);
    
    const fileInfo = {
      id: uuidv4(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      category: 'secure',
      description: req.body.description || 'Secure file'
    };
    
    res.json({
      message: 'Secure file uploaded successfully',
      file: fileInfo
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Secure upload failed', error: error.message });
  }
});

module.exports = router; 