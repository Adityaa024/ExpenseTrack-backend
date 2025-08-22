# ExpenseTracker Backend

This is the backend for the ExpenseTracker application. It provides RESTful APIs for managing users and expenses.

## Features
- User registration and authentication
- Expense CRUD operations
- JWT-based authentication middleware
- MongoDB database integration

## Project Structure
```
backend/
├── controllers/
│   ├── expense.controller.js
│   └── user.controller.js
├── db/
│   └── db.js
├── middleware/
│   └── isAuthenticated.js
├── models/
│   ├── expense.model.js
│   └── user.model.js
├── routes/
│   ├── expense.router.js
│   └── user.routes.js
├── index.js
├── package.json
├── .env
├── .gitignore
```

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `.env` file with MongoDB URI and JWT secret
4. Start the server:
   ```
   npm start
   ```

## API Endpoints
- `/api/users` - User operations
- `/api/expenses` - Expense operations

## License
MIT
