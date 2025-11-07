<p align="center">
    <img src="https://github.com/ausgomez/awesome-tree-api/blob/main/src/assets/tree.png?raw=true" width="" alt="Awesome Tree Logo" />
</p>

## Description

A production-ready REST API for managing hierarchical tree data structures, featuring comprehensive CRUD operations and showcasing Model Context Protocol (MCP) integration capabilities.

Features
✅ Create and manage tree nodes with parent-child relationships
✅ RESTful API endpoints
✅ Input validation and error handling
✅ PostgreSQL database with Docker
✅ Interactive API documentation (Swagger)
✅ Comprehensive test coverage
✅ TypeScript for type safety

## Prerequisites
Make sure you have these installed:

- Node.js (v18+)
- Docker Desktop

## Quick Start
1. Install Dependencies
   ```bash
    pnpm install
   ```
2. Set Up Environment Variables
   Create a .env file in the project root:
   ```bash
   cp .env.example .env
   ```
   Default values work out of the box - no changes needed!
3. Start the Database
   ```bash
   docker compose up -d
   ```
   This starts PostgreSQL in a Docker container.
4. Start the Application
   ```bash
   pnpm run start:dev
   ```
   The API is now running at `http://localhost:3000/api`

## API Endpoints

You can find the complete list of endpoints by visiting `http://localhost:3000/api/docs`


## Testing the API
You can try the endpoints using curl or other tools like Postman
### Get all trees
```bash
curl http://localhost:3000/api/tree
```

### Create a root node
```bash
curl -X POST http://localhost:3000/api/tree \
-H "Content-Type: application/json" \
-d '{"label": "root"}'
```

### Create a child node
```bash
curl -X POST http://localhost:3000/api/tree \
-H "Content-Type: application/json" \
-d '{"label": "bear", "parentId": 1}'
```

### Delete a node
```bash
curl -X DELETE http://localhost:3000/api/tree/{id}
```