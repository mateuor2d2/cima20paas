#!/bin/bash
# Deploy script for cima20paas on Render
set -e

echo "🚀 CIMA20 PaaS Deploy Script"
echo "=============================="

# Check if we're on master branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    echo "❌ ERROR: Not on master branch. Current: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ ERROR: Uncommitted changes exist"
    git status --short
    exit 1
fi

echo "✅ Branch check passed"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin master
echo "✅ Push complete"

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo ""
    echo "⚠️  Render CLI not installed"
    echo ""
    echo "To deploy manually:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect GitHub repo: mateuor2d2/cima20paas"
    echo "4. Configure:"
    echo "   - Name: cima20paas"
    echo "   - Runtime: Node"
    echo "   - Build Command: bun install && bun run build"
    echo "   - Start Command: node .output/server/index.mjs"
    echo "   - Plan: Starter ($7/month)"
    echo "5. Add Environment Variables:"
    echo "   - NODE_ENV=production"
    echo "   - NUXT_PUBLIC_SITE_URL=https://cima20paas.onrender.com"
    echo "6. Click 'Create Web Service'"
    echo ""
    echo "Or install Render CLI:"
    echo "   curl -fsSL https://raw.githubusercontent.com/render-oss/render-cli/main/install.sh | bash"
    exit 0
fi

# Deploy using Render CLI
echo "🚀 Deploying to Render..."
render deploy --service cima20paas
echo "✅ Deploy triggered!"
