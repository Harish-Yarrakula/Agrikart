# Agrikart
An ecommerce platform for farmers

## Overview
Agrikart is a Next.js-based ecommerce platform designed to connect farmers directly with consumers. The platform allows farmers to showcase and sell their products online.

## Technologies Used
- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Node.js** - Runtime environment

## Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production
Build the application:
```bash
npm run build
```

### Running Production Server
Start the production server:
```bash
npm start
```

### Linting
Check code quality:
```bash
npm run lint
```

## Project Structure
```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── products/      # Products API endpoint
│   ├── products/          # Products page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Features
- Home page with platform introduction
- Products listing page
- Products API endpoint
- Responsive design with Tailwind CSS
- TypeScript support for type safety
- Server-side rendering with Next.js

## API Endpoints
- `GET /api/products` - Fetch all products

## License
This project is open source and available under the MIT License.
