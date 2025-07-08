# TD Studios Portal

**Tyler's Personal Command Center**

A Notion-style dashboard built specifically for Tyler Davis (TD Studios NY) to manage projects, files, tasks, and interact with a personal AI assistant.

## Features

### 🎯 Core Features
- **Personal Dashboard**: Daily command center with project overview, tasks, and recent activity
- **AI Assistant**: Claude-powered chatbot with personal context about Tyler's projects and preferences
- **File Storage**: Secure storage for .env files, media, documents, and other sensitive files
- **Project Management**: Track projects, progress, and tech stacks
- **Task Management**: Organize and prioritize tasks across projects
- **Black & White Theme**: Clean, professional monochrome design

### 🚀 Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, Socket.io
- **Authentication**: JWT-based single-user authentication
- **File Storage**: Multer for file uploads
- **Real-time**: Socket.io for AI chat

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tdstudiosny/td-studios-portal.git
   cd td-studios-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   
   **Backend (Express.js)**
   ```bash
   npm run dev:server
   ```
   
   **Frontend (Next.js)**
   ```bash
   npm run dev
   ```

4. **Access the portal**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with: `tyler` / `tdstudios2024`

## Project Structure

```
td-studios-portal/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── server/                 # Express.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── index.js            # Server entry point
├── file-storage/           # File storage directory
│   ├── uploads/            # User uploaded files
│   ├── secure/             # Secure files (.env, etc.)
│   └── metadata.json       # File metadata
├── ai-brain/               # AI context and chat history
│   ├── contexts/           # AI context files
│   └── chat-history.json   # Chat history
└── package.json            # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/projects` - Get all projects
- `GET /api/dashboard/tasks` - Get all tasks
- `PUT /api/dashboard/tasks/:id` - Update task status

### Files
- `GET /api/files/list` - List all files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/:filename` - Download file
- `DELETE /api/files/delete/:filename` - Delete file
- `POST /api/files/secure-upload` - Upload secure file

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/history` - Get chat history
- `DELETE /api/ai/history` - Clear chat history
- `GET /api/ai/context` - Get Tyler's context

## Usage

### Daily Workflow
1. **Morning Login**: Access your personal dashboard
2. **Overview Check**: Review project status, pending tasks, recent activity
3. **File Management**: Upload/access .env files, documents, media
4. **AI Assistance**: Chat with your personal AI about projects, code, or general help
5. **Task Management**: Update task status, add new tasks
6. **Project Tracking**: Monitor project progress and milestones

### Security Features
- Single-user authentication (Tyler-only access)
- Secure file storage for sensitive documents
- JWT-based session management
- Protected API routes

## Development

### Scripts
- `npm run dev` - Start Next.js development server
- `npm run dev:server` - Start Express.js backend server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
Create a `.env.local` file:
```env
JWT_SECRET=your-secret-key
PORT=5000
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Set production environment variables
2. Configure file storage paths
3. Set up proper JWT secrets
4. Configure AI service endpoints

## Customization

### Adding New Features
1. Create new components in `app/components/`
2. Add API routes in `server/routes/`
3. Update navigation in `Sidebar.tsx`
4. Add styling in `globals.css`

### Modifying AI Context
Update `server/routes/ai.js` to modify Tyler's personal context and AI responses.

## Support

This is Tyler's personal portal. For technical issues or feature requests, contact Tyler directly.

## License

Private - TD Studios NY Internal Use Only
