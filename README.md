# **Library Catalog Backend**

A backend system for managing a library catalog built with **NestJS** and **PostgreSQL**. The application includes functionality for managing books, students, and borrowed records, with robust error handling, validation, and health checks.

---

## **Features**
- **Book Management**: Add, update, view, and delete books with key attributes like title, author, ISBN, and availability.
- **Student Management**: Manage student records, including creating, updating, viewing, and deleting student information.
- **Borrowed Books Management**: Borrow and return books, ensuring that the library tracks book availability and borrowed records.
- **Health Checks**: Monitor the application's health, uptime, and database connectivity.
- **Error Handling**: Unified error responses with meaningful messages and proper HTTP status codes.
- **Validation**: Comprehensive request validation using DTOs and `class-validator`.

---

## **Technologies Used**
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)
- **API Documentation**: Swagger (optional setup)

---

## **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ricky-ultimate/bunkolink-backend
   cd bunkolink-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   - Create a `.env` file in the project root with the following variables:
     ```
     DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
     ```
4. Apply Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## **Endpoints**

| **Endpoint**                    | **Method** | **Description**                                                                                  |
|----------------------------------|------------|--------------------------------------------------------------------------------------------------|
| `/v1/books`                     | `POST`     | Add a new book to the library.                                                                  |
| `/v1/books`                     | `GET`      | Retrieve a list of all books in the library.                                                    |
| `/v1/books/:id`                 | `GET`      | Retrieve details of a specific book by its ID.                                                  |
| `/v1/books/:id`                 | `PATCH`    | Update the details of a specific book by its ID.                                                |
| `/v1/books/:id`                 | `DELETE`   | Delete a specific book by its ID.                                                               |
| `/v1/students`                  | `POST`     | Add a new student to the library system.                                                        |
| `/v1/students`                  | `GET`      | Retrieve a list of all students.                                                                |
| `/v1/students/:id`              | `GET`      | Retrieve details of a specific student by their ID.                                             |
| `/v1/students/:id`              | `PATCH`    | Update the details of a specific student by their ID.                                           |
| `/v1/students/:id`              | `DELETE`   | Delete a specific student by their ID.                                                          |
| `/v1/borrowed-books/borrow`     | `POST`     | Borrow a book by providing the book ID and student ID.                                          |
| `/v1/borrowed-books/return/:id` | `POST`     | Return a borrowed book by providing the borrowed book ID.                                       |
| `/v1/borrowed-books`            | `GET`      | Retrieve a list of all borrowed books, including student and book details.                      |
| `/v1/health`                    | `GET`      | Retrieve the application health status, including uptime and database connectivity information. |

---

## **Error Handling**

The application provides meaningful error messages with proper HTTP status codes:
- **404 Not Found**: For non-existent records (e.g., trying to retrieve or delete a book that doesn’t exist).
- **400 Bad Request**: For invalid input or operations (e.g., borrowing a book when no copies are available).
- **409 Conflict**: For duplicate entries (e.g., adding a book or student with an existing unique attribute).

Example error response format:
```json
{
  "statusCode": 404,
  "message": "Book with ID 42 not found.",
  "timestamp": "2024-12-18T12:00:00.000Z",
  "path": "/v1/books/42"
}
```

---

## **Development**

### Running the Application
- Start the application in development mode:
  ```bash
  npm run start:dev
  ```

### Running Tests
- Run unit tests:
  ```bash
  npm run test
  ```
- Run end-to-end tests:
  ```bash
  npm run test:e2e
  ```

### Building the Application
- Build the application for production:
  ```bash
  npm run build
  ```
