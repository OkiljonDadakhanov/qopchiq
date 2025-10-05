# Qopchiq API Postman Collection

This document describes how to use the Postman collection for testing the Qopchiq API endpoints.

## Setup Instructions

1. Import the collection:
   - Open Postman
   - Click "Import" button
   - Select `postman_collection.json` file
   - Click "Import"

2. Set up environment variables:
   Create a new environment in Postman with these variables:
   - `BASE_URL`: Default is `http://localhost:5000`

3. Required Environment Variables for Backend:
   Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

## Available Endpoints

### Authentication

1. **Sign Up**
   - URL: `POST {{BASE_URL}}/api/auth/signup`
   - Body:
     ```json
     {
         "name": "Test User",
         "email": "test@example.com",
         "password": "testpassword123"
     }
     ```

2. **Login**
   - URL: `POST {{BASE_URL}}/api/auth/login`
   - Body:
     ```json
     {
         "email": "test@example.com",
         "password": "testpassword123"
     }
     ```

3. **Logout**
   - URL: `POST {{BASE_URL}}/api/auth/logout`
   - No body required
   - Requires authentication cookie

## Notes
- The API uses HTTP-only cookies for JWT storage
- All responses are in JSON format
- Error responses include `success: false` and an error message
- Success responses include `success: true` and relevant data