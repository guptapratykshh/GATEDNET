# GatedNet

A hyperlocal MERN application for gated communities that streamlines communication, management, and engagement within apartment societies.

## Features

- **User Authentication**: Secure login with geofencing capabilities
- **Issue Tracking**: Report and track maintenance issues
- **Voting & Polling**: Make community decisions transparently
- **Amenity Booking**: Book and manage shared facilities
- **Announcements**: Real-time updates for community members
- **Admin Dashboard**: Manage community and residents

## Tech Stack

- **MongoDB**: NoSQL database for storing community data
- **Express.js**: Backend API framework
- **React**: Frontend UI library
- **Node.js**: JavaScript runtime for the server
- **Socket.io**: Real-time communication
- **JWT**: Authentication with JSON Web Tokens
- **Tailwind CSS**: Utility-first CSS framework

## Project Structure

```
.
├── client/                 # Frontend React application
└── server/                 # Backend Express API
    ├── src/
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Middleware functions
    │   ├── models/         # Mongoose models
    │   ├── routes/         # API routes
    │   ├── utils/          # Utility functions
    │   └── index.js        # Entry point
    ├── .env.example        # Example environment variables
    └── package.json        # Server dependencies
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed locally or MongoDB Atlas account
- Git for version control

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Set up environment variables:
   ```
   cp server/.env.example server/.env
   ```
   Then edit the `.env` file with your configuration.

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user (admin only)

### Issues
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get a specific issue
- `POST /api/issues` - Create a new issue
- `PUT /api/issues/:id` - Update an issue
- `DELETE /api/issues/:id` - Delete an issue

### Polls
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls` - Create a new poll (admin only)
- `PUT /api/polls/:id` - Update a poll (admin only)
- `DELETE /api/polls/:id` - Delete a poll (admin only)
- `POST /api/polls/:id/vote` - Vote on a poll

### Amenities
- `GET /api/amenities` - Get all amenities
- `GET /api/amenities/:id` - Get a specific amenity
- `POST /api/amenities` - Create a new amenity (admin only)
- `PUT /api/amenities/:id` - Update an amenity (admin only)
- `DELETE /api/amenities/:id` - Delete an amenity (admin only)
- `POST /api/amenities/:id/book` - Book an amenity
- `GET /api/amenities/:id/bookings` - Get bookings for an amenity

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get a specific announcement
- `POST /api/announcements` - Create a new announcement (admin only)
- `PUT /api/announcements/:id` - Update an announcement (admin only)
- `DELETE /api/announcements/:id` - Delete an announcement (admin only)

## License

This project is licensed under the MIT License.