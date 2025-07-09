#!/bin/bash

# TD Studios AI Beast Portal - Deployment Script
# This script will push changes to GitHub and trigger Vercel redeployment

echo "🚀 TD Studios AI Beast Portal - Deployment Starting..."

# Add all changes
git add .

# Commit with timestamp
git commit -m "🎯 Complete TD Studios AI Beast Portal setup - Remove champagne room references"

# Push to main branch
git push origin main

echo "✅ Changes pushed to GitHub"

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🔄 Deploying to Vercel..."
vercel --prod

echo "🎉 TD Studios AI Beast Portal deployment complete!"
echo "🌐 Your portal is live at: https://td-studios-ai-beast-portal.vercel.app" 