// // Advanced error handling middleware
// const errorHandler = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   // Log error
//   console.error(err);

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     const message = 'Resource not found';
//     error = { message, statusCode: 404 };
//   }

//   // Mongoose duplicate key
//   if (err.code === 11000) {
//     const message = 'Duplicate field value entered';
//     error = { message, statusCode: 400 };
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const message = Object.values(err.errors).map(val => val.message).join(', ');
//     error = { message, statusCode: 400 };
//   }

//   // Multer file upload errors
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       error = { message: 'File too large', statusCode: 400 };
//     } else if (err.code === 'LIMIT_FILE_COUNT') {
//       error = { message: 'Too many files', statusCode: 400 };
//     } else {
//       error = { message: 'File upload error', statusCode: 400 };
//     }
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     error = { message: 'Invalid token', statusCode: 401 };
//   }

//   if (err.name === 'TokenExpiredError') {
//     error = { message: 'Token expired', statusCode: 401 };
//   }

//   // Firestore errors
//   if (err.code && err.code.startsWith('firestore/')) {
//     error = { message: 'Database operation failed', statusCode: 500 };
//   }

//   // Gemini API errors
//   if (err.message && err.message.includes('Gemini')) {
//     error = { message: 'AI service unavailable', statusCode: 503 };
//   }

//   res.status(error.statusCode || 500).json({
//     success: false,
//     error: error.message || 'Server Error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// };

// module.exports = errorHandler;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `pdf-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;