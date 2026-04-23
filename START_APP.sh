#!/bin/bash
echo "=========================================="
echo "Starting MaysMelody Media Player..."
echo "=========================================="

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install it from https://nodejs.org/"
    exit
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "[1/2] Installing player components (this may take a minute)..."
    npm install
fi

# Run the app
echo "[2/2] Launching MaysMelody..."
npm run dev
