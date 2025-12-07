# AdForge

AdForge transforms product photos into complete marketing campaigns using AWS Bedrock.

It analyzes your product image to understand its features, target audience, and mood. Then, it generates a suite of marketing assets:
- Professional product photography (Studio, Luxury, or Playful styles)
- Instagram captions and hashtags
- Email subject lines
- Ad headlines and copy

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Python, FastAPI
- **AI:** AWS Bedrock (Nova Lite for vision/text, Nova Canvas for image generation)

## Setup

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env  # Add your AWS credentials
   poetry install
   poetry run uvicorn app.main:app --reload
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Usage**
   Open http://localhost:5173, upload a product image, and click Generate.

## API

**POST /api/campaign**
Accepts a base64 image and optional style parameter. Returns analyzed product details, generated marketing copy, and a styled product image.
