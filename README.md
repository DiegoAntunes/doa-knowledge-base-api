# Dynamic Knowledge Base API

A RESTful API built with Node.js and TypeScript to manage a **Dynamic Knowledge Base System**. It supports:

- Versioned topics with history  
- Hierarchical topic trees  
- Resources linked to topics  
- Role-based permissions (Admin, Editor, Viewer)  
- Custom algorithms and design patterns (Factory, Strategy, Composite)

---

## Tech Stack

- **Node.js** + **TypeScript**  
- **Express** (web framework)  
- **Jest** + **Supertest** (testing)  
- **JSON file storage** (simple persistence)  
- **Design Patterns**: Strategy, Factory, Composite  
- **OOP Principles** and SOLID code organization

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DiegoAntunes/doa-knowledge-base-api.git
cd doa-knowledge-base-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server (Development Mode)

```bash
npm run dev
```

Server will run at: `http://localhost:3000`

### 4. Run Tests

```bash
# All tests (unit + integration)
npm test

# Run integration tests sequentially
npm run test:integration
```

> Ensure `test/database/*.json` files exist and are initialized as empty arrays (`[]`).

---

## User Roles & Permissions

Permissions are enforced using a **Strategy Pattern** and injected via headers:

```http
x-user-id: <user_id>
```

### Roles

| Role   | Permissions                                 |
|--------|---------------------------------------------|
| Admin  | Full access to all features                 |
| Editor | Can create/update topics and resources      |
| Viewer | Read-only access                            |

> Simulated auth middleware uses the `x-user-id` to resolve the user.

---

## API Endpoints

### Topics

| Method | Endpoint                                 | Description                          |
|--------|------------------------------------------|--------------------------------------|
| POST   | `/topics`                                | Create a new topic                   |
| PUT    | `/topics/:id`                            | Update a topic (creates new version) |
| DELETE | `/topics/:id`                            | Delete a topic                       |
| GET    | `/topics`                                | List all topics                      |
| GET    | `/topics/:id`                            | Get topic by ID                      |
| GET    | `/topics/:id/children`                   | Get direct children of a topic       |
| GET    | `/topics/hierarchy`                      | Get full topic tree hierarchy        |
| GET    | `/topics/:id/versions`                   | List all versions of a topic         |
| GET    | `/topics/:id/versions/:versionNumber`    | Get a specific version               |
| GET    | `/topics/:id/tree`                       | Recursively retrieve subtopics       |
| GET    | `/topics/:id/tree-composite`             | Retrieve topic tree using Composite  |
| GET    | `/topics/path?from=A&to=B`               | Shortest path between two topics     |

### Resources

| Method | Endpoint                          | Description                      |
|--------|-----------------------------------|----------------------------------|
| POST   | `/resources`                      | Create a new resource            |
| PUT    | `/resources/:id`                  | Update a resource                |
| DELETE | `/resources/:id`                  | Delete resource                  |
| GET    | `/resources`                      | List all resources               |
| GET    | `/resources/:id`                  | Get resource by ID               |
| GET    | `/resources/topic/:topicId`       | Get resources by topic ID        |


### Users

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `/users`          | Create a new user                    |
| PUT    | `/users/:id`      | Update user (Editor/Admin only)      |
| DELETE | `/users/:id`      | Delete user (Admin only)             |
| GET    | `/users`          | List all users (Admin only)          |
| GET    | `/users/:id`      | Get user by ID (self or Admin only)  |


---

## Testing

- ✅ **Unit tests** for all services  
- ✅ **Integration tests** covering end-to-end flows  
- ✅ **Mocked controller tests** for isolated behavior  
- ✅ Custom **test database files** to ensure isolation

Run:

```bash
npm test
```

> Integration tests are run with `--runInBand` to avoid concurrency issues with JSON files.

---

## Design Patterns Used

| Pattern    | Purpose                                   |
|------------|-------------------------------------------|
| **Factory**  | Topic versioning creation logic           |
| **Strategy** | Role-based permissions and authorization |
| **Composite**| Topic hierarchy with tree recursion      |

---

## Project Structure

```
src/
├── @types/
├── composite/
├── controllers/
├── database/
├── factories/
├── middlewares/
├── models/
├── permissions/
├── routes/
├── services/
test/
├── controllers/
├── database/  <- test JSON files
├── integration/
├── permissions/
├── services/
└── utils/
```

---

## Requirements Coverage

- [x] CRUD for Topics with Version Control
- [x] Recursive Hierarchical Retrieval
- [x] Shortest Path Algorithm (custom BFS)
- [x] Resource management
- [x] Role-based permissions using Strategy Pattern
- [x] OOP: Interfaces, abstract classes, design patterns
- [x] File-based persistence
- [x] Custom error handling middleware
- [x] Unit & integration tests with mocks

---

## Submission Notes

This project was built to fulfill a technical challenge with focus on:

- Clean code and separation of concerns  
- Realistic simulation of complex domain logic  
- High test coverage and modularity  

To run locally, clone, install dependencies, and execute via:

```bash
npm run dev
```

> For test environments, run with:

```bash
npm test
```
