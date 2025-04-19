# Dynamic Knowledge Base API

A RESTful API built with Node.js and TypeScript to manage a dynamic knowledge base system. This API handles versioned topics, hierarchical relationships, associated resources, and role-based permissions.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- Jest + Supertest (unit & integration testing)
- File-based JSON storage
- Design Patterns: Strategy, Factory, Composite

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/knowledge-base-api.git
cd knowledge-base-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server in development mode

```bash
npm run dev
```

### 4. Run tests

```bash
# Unit + Integration
npm test

# Only integration
npm run test:integration
```

> Make sure the `test/database/*.json` files exist as empty arrays: `[]`

---

## User Roles and Permissions

Permissions are determined by the `x-user-role` HTTP header. Available roles:

- `Admin`: full access
- `Editor`: can create and update topics, cannot delete
- `Viewer`: read-only access

Example:

```http
GET /topics
x-user-role: Editor
```

---

## API Endpoints

### Topics
- `GET /topics`: list all topics
- `POST /topics`: create new topic
- `PUT /topics/:id`: update (creates new version)
- `DELETE /topics/:id`
- `GET /topics/:id`: get topic by ID
- `GET /topics/:id/versions`: list all versions
- `GET /topics/:id/versions/:versionNumber`: get specific version
- `GET /topics/:id/tree`: recursive hierarchy
- `GET /topics/path?from=A&to=B`: shortest path between topics

### Users
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `DELETE /users/:id`

### Resources
- `GET /resources`
- `POST /resources`
- `GET /resources/:id`
- `GET /resources/topic/:topicId`
- `DELETE /resources/:id`

---

## Testing

- All services are covered by unit tests
- Core business flows are covered by integration tests
- Tests use isolated `.test.json` files for data

Run tests:

```bash
npm test
```

---

## Design Patterns

- **Strategy**: permission rules per role
- **Factory**: creation of versioned topics
- **Composite**: tree structure for topics with children
