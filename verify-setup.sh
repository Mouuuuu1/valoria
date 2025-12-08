#!/bin/bash

# Valorina Setup Verification Script
# This script checks if your development environment is properly configured

echo "🔍 Valorina Setup Verification"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Found: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    exit 1
fi

# Check MongoDB
echo -n "Checking MongoDB... "
if command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✓${NC} Found (mongosh)"
elif command -v mongo &> /dev/null; then
    echo -e "${GREEN}✓${NC} Found (mongo)"
else
    echo -e "${YELLOW}⚠${NC} Not found locally. Make sure you have MongoDB Atlas or install MongoDB"
fi

echo ""
echo "📦 Checking Backend Dependencies"
echo "================================"

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed. Run: cd backend && npm install"
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
else
    echo -e "${YELLOW}⚠${NC} Backend .env file not found. Copy from .env.example"
fi

echo ""
echo "🎨 Checking Frontend Dependencies"
echo "================================"

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed. Run: cd frontend && npm install"
fi

if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env.local file exists"
else
    echo -e "${YELLOW}⚠${NC} Frontend .env.local file not found. Copy from .env.example"
fi

echo ""
echo "📄 Checking Documentation"
echo "================================"

docs=("README.md" "ARCHITECTURE.md" "QUICKSTART.md" "COURSE_GUIDE.md" "PROJECT_SUMMARY.md" "CHECKLIST.md")

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
    else
        echo -e "${RED}✗${NC} $doc missing"
    fi
done

echo ""
echo "🏗️ Checking Project Structure"
echo "================================"

dirs=("backend/src/controllers" "backend/src/services" "backend/src/models" "backend/src/routes" "backend/src/middleware" "frontend/src/app" "frontend/src/components" "frontend/src/context" "frontend/src/lib")

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir"
    else
        echo -e "${RED}✗${NC} $dir missing"
    fi
done

echo ""
echo "📋 Summary"
echo "================================"
echo ""
echo "Next steps:"
echo "1. If dependencies not installed: npm install in backend and frontend"
echo "2. If .env files missing: Copy from .env.example and configure"
echo "3. Start MongoDB: brew services start mongodb-community (macOS)"
echo "4. Seed database: cd backend && npm run seed"
echo "5. Run backend: cd backend && npm run dev"
echo "6. Run frontend: cd frontend && npm run dev"
echo "7. Visit: http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo ""
