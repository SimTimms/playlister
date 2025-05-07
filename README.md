# Chatbot API with RAG

This is a Node.js API that implements Retrieval Augmented Generation (RAG) using OpenAI's API and ChromaDB for vector storage.

## Features

- Question answering with context from stored documents
- Document management for RAG system
- TypeScript support
- Express.js REST API
- OpenAI integration

## Prerequisites

- Node.js 16+
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

For development:

```bash
npm run dev
```

## API Endpoints

### Add Document

```http
POST /api/documents/add
Content-Type: application/json

{
  "content": "Your document text here",
  "metadata": {
    "source": "optional source",
    "author": "optional author"
  }
}
```

### Ask Question

```http
POST /api/chat/ask
Content-Type: application/json

{
  "question": "Your question here"
}
```

### Health Check

```http
GET /health
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `OPENAI_API_KEY`: Your OpenAI API key

## Development

The project uses TypeScript and follows modern development practices. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
