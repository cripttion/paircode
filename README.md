# Real-Time Collaborative Code Editor

A simplified real-time pair programming environment allowing users to create rooms, share code in real-time, and receive mocked AI autocomplete suggestions.

## working sample video link : https://www.loom.com/share/c21c6e573c1748a4b0cf4bb2b8002eec

## 🚀 How to Run

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL (Optional, defaults to sqllite database)

### 1. Backend Setup
The backend is built with FastAPI and handles WebSocket connections for real-time syncing.

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
The backend will start at `http://localhost:8000`.

### 2. Frontend Setup
The frontend is a React application using Vite and Monaco Editor.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 🏗 Architecture & Design Choices

### Tech Stack
- **Frontend**: React, TypeScript, Redux Toolkit, Monaco Editor.
- **Backend**: Python FastAPI, SQLAlchemy, WebSockets.
- **Database**: PostgreSQL (configured via `DATABASE_URL`) 

### Key Design Decisions

1.  **WebSocket for Real-Time Sync**:
    -   Used raw WebSockets over HTTP polling for low-latency code synchronization.
    -   The server acts as a broadcaster: when User A types, the change is sent to the server and broadcast to User B.

2.  **"Last-Write-Wins" Strategy**:
    -   For this prototype, we used a simple "last-write-wins" approach. The server accepts the latest string of code and broadcasts it.
    -   *Trade-off*: This is simple to implement but can lead to race conditions if two users type exactly at the same time.

3.  **Monaco Editor Integration**:
    -   Chosen for its rich feature set (VS Code-like experience).
    -   Autocomplete is integrated via a custom completion provider that queries the backend.

4.  **Mocked AI Autocomplete**:
    -   To simulate an AI coding assistant, a simple rule-based system runs on the backend.
    -   It provides deterministic suggestions based on keywords (e.g., typing `def` suggests `pass`) or random snippets for other inputs.

---

## ⚠️ Limitations

1.  **Concurrency Control**:
    -   The current implementation does not use Operational Transformation (OT) or CRDTs (Conflict-free Replicated Data Types).
    -   **Issue**: If two users edit different parts of the file simultaneously, one user's changes might overwrite the other's entire file state because we sync the *entire* file content rather than deltas.

2.  **Cursor Management**:
    -   Remote cursors are not visualized. You cannot see where the other user is typing.
    -   Syncing full content can sometimes cause the local cursor to jump if not handled carefully (though basic mitigation is in place).

3.  **Scalability**:
    -   In-memory WebSocket connection management works for a single server instance but would need Redis/PubSub for a multi-server deployment.

---

## 🔮 Future Improvements

If I had more time, I would prioritize the following:

1.  **Operational Transformation (OT) / CRDTs**:
    -   Implement Yjs or Automerge to handle concurrent edits gracefully. This would allow multiple users to edit the same document without overwriting each other.

2.  **Real AI Integration**:
    -   Replace the mocked endpoint with a real LLM (e.g., OpenAI Codex or generic GPT-4) to provide context-aware code completion.

3.  **Cursor Sharing**:
    -   Broadcast cursor positions and selections so users can see each other's presence in the document.

4.  **Authentication & Persistence**:
    -   Add user accounts (Auth0 or JWT).
    -   Save file history and allow users to revert to previous versions.

5.  **Deployment**:
    -   Dockerize the application for easy deployment.
    -   Set up a CI/CD pipeline.
