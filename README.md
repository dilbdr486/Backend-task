# Car Management Backend API

A Node.js/Express backend API for managing cars with authentication and CSV import functionality.

## Features

- **Authentication**: JWT-based authentication with admin user seeding
- **Car CRUD**: Complete CRUD operations for car management
- **CSV Import**: Upload and import car data from CSV files with validation

## Prerequisites

- Node.js (v14 or higher)
- Postman or other simillar
- MySQL database
- npm

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

4. Update the `.env` file with your database credentials:

   ```
   DB_HOST=localhost
   DB_USER= or your_db_user_name
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   JWT_SECRET=your-super-secret-jwt-key
   PORT=your_port
   ```

5. Create the database:

   ```sql
   CREATE DATABASE your_database_name;
   ```

6. Run the database schema:

   ```bash
   mysql -u root -p your_database_name < src/config/schema.sql
   ```

   Or manually execute the SQL in `src/config/schema.sql`

   Or manually execute the SQL in the sql workbench.

7. Seed the admin user:
   ```bash
   npm run seed
   ```

## Default Admin Credentials

- **Email**: admin@example.com
- **Password**: Admin@123

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`)


## API Endpoints

### Authentication

- `POST /auth/login` - Login user
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin@123"
  }
  ```
- Example:http://localhost:4000/auth/login

### Cars (Protected - Requires JWT Token)

- `POST /cars` - Create a new car
   ```json
   {
  "make_name": "Acura",
  "model_name": "ILX",
  "trim_name": "Base",
  "trim_description": "4dr Sedan (2.4L 4cyl 8AM)",
  "engine_type": "gas",
  "engine_fuel_type": "premium unleaded (recommended)",
  "engine_cylinders": 14,
  "engine_size": 2.4,
  "engine_horsepower_hp": 201,
  "engine_horsepower_rpm": 6800,
  "engine_drive_type": "front wheel drive",
  "body_type": "Sedan",
  "body_doors": 4,
  "body_seats": 5
   }
   ```
- `GET /cars` - Get all cars (supports pagination: `?page=1&limit=10`)
- `GET /cars/:id` - Get a single car by ID
- `PUT /cars/:id` - Update a car
- `DELETE /cars/:id` - Delete a car
- `POST /cars/upload-csv` - Upload and import CSV file
   body->form data,
   key:file
   choose:file and upload

### Authentication Header

Include the JWT token in the Authorization header:

```
Authorization: Bearer Token <your-jwt-token>
```

## CSV Upload Format

The CSV file should include the following columns:

**Required fields:**

- `make_name`
- `model_name`
- `engine_type`
- `body_type`

**Optional fields:**

- `trim_name`
- `trim_description`
- `engine_fuel_type`
- `engine_cylinders` (numeric)
- `engine_size` (numeric)
- `engine_horsepower_hp` (numeric)
- `engine_horsepower_rpm` (numeric)
- `engine_drive_type`
- `body_doors` (numeric)
- `body_seats` (numeric)


## Project Structure

```
src/
├── config/
│   ├── db.js          # Database connection
│   ├── schema.sql     # Database schema
│   └── seed.js        # Admin user seeder
├── controllers/
│   ├── car.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.js        # JWT authentication middleware
│   └── multer.js      # File upload configuration
├── routes/
│   ├── auth.route.js
│   └── cars.route.js
├── services/
│   └── user.service.js
├── utils/
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   └── csvHandler.js
└── server.js
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```
# Backend-Task
# Backend-task
