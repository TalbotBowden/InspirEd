#!/bin/bash

# Start Firebase Emulator for local testing
echo "🔥 Starting Firebase Emulators..."
echo ""
echo "Emulator UI will be available at: http://localhost:4000"
echo "Functions emulator running on port: 5001"
echo ""
echo "To test, run in another terminal:"
echo "  node functions/test-emulator.js"
echo ""

# Export the Gemini API key for the Cloud Functions
export GEMINI_API_KEY="$STUDIO_GEMINI_KEY"

# Start the emulator
cd "$(dirname "$0")"
npx firebase emulators:start --only functions
