# 🚀 TD Studios Portal - Quick Start Guide

**Tyler's Personal Command Center**

## ⚡ Start Your Portal (2 steps)

### 1. Start Backend Server
```bash
npm run dev:server
```
*Server will run on port 5001*

### 2. Start Frontend (in new terminal)
```bash
npm run dev
```
*Frontend will run on port 3000*

## 🔑 Access Your Portal

**URL**: http://localhost:3000
**Username**: `tyler` or `tyler@tdstudiosny.com`
**Password**: `tdstudios2024`

## 🛑 Stop Your Portal

Press `Ctrl+C` in both terminal windows

## 📁 What You Can Do

- ✅ **Dashboard**: View projects, tasks, recent activity
- ✅ **AI Assistant**: Chat with your personal AI about projects
- ✅ **File Manager**: Upload .env files, documents, media
- ✅ **Project Tracking**: Monitor TD Studios project progress
- ✅ **Task Management**: Organize and complete tasks

## 🔧 Troubleshooting

**Port conflicts?**
```bash
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**Fresh start?**
```bash
npm install
npm run dev:server
npm run dev
```

## 🎯 Daily Use

1. Open terminal
2. Run the 2 start commands above
3. Go to http://localhost:3000
4. Login and manage your TD Studios empire!

---

**Built for Tyler Davis - TD Studios NY**  
*Your personal command center for luxury platforms and projects* 