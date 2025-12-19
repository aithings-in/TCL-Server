# TCL Server

A robust Node.js server built with TypeScript, MongoDB, and AWS S3 integration, following MVC architecture best practices.

## Features

- ✅ **Node.js + TypeScript** - Type-safe server development
- ✅ **MongoDB** - NoSQL database with Mongoose ODM
- ✅ **AWS S3** - File upload and storage integration
- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **JWT Authentication** - Secure user authentication
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Input Validation** - Request validation with express-validator
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Rate Limiting** - API rate limiting for security
- ✅ **Security** - Helmet, CORS, and other security middleware

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   └── s3.ts         # AWS S3 configuration
│   ├── controllers/      # Request handlers (MVC Controllers)
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── registration.controller.ts
│   │   └── upload.controller.ts
│   ├── models/           # Database models (MVC Models)
│   │   ├── User.model.ts
│   │   └── Registration.model.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── registration.routes.ts
│   │   └── upload.routes.ts
│   ├── services/         # Business logic services
│   │   └── s3.service.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validator.middleware.ts
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts          # Application entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and fill in your configuration:
   - MongoDB connection string
   - AWS S3 credentials
   - JWT secret
   - Other configuration values

3. **Start MongoDB:**
   Make sure MongoDB is running locally or use MongoDB Atlas for cloud database.

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for auto-reloading.

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile (Protected)
- `GET /api/users` - Get all users (Admin only)

### Registrations
- `POST /api/registrations` - Create a new registration (Public)
- `GET /api/registrations` - Get all registrations (Admin/Moderator)
- `GET /api/registrations/:id` - Get single registration (Admin/Moderator)
- `PATCH /api/registrations/:id/status` - Update registration status (Admin/Moderator)
- `DELETE /api/registrations/:id` - Delete registration (Admin only)

### File Upload
- `POST /api/upload/single` - Upload single file (Protected)
- `POST /api/upload/multiple` - Upload multiple files (Protected)
- `DELETE /api/upload/:key` - Delete file (Protected)

### Health Check
- `GET /health` - Server health check

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tcl
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/tcl

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **AWS SDK** - AWS S3 integration
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File upload handling
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

## Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## License

ISC
