# WalkInOnline - Barbershop Queue Management System

WalkInOnline is a streamlined, AI-powered queue and appointment management platform for barbershops, enabling real-time wait time estimates, service selection, and appointment booking.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
  - [Method 1: Local Development](#method-1-local-development)
  - [Method 2: Using Docker](#method-2-using-docker)
- [Project Structure](#project-structure)
- [Features](#features)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Website Configuration](#configure-the-website)

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or later)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerization)

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/fawad1997/BarberQMSFrontend.git
cd BarberQMSFrontend
```

2. Create a `.env` file in the root directory with the following content:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-key-here
```

## Installation

### Method 1: Local Development

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 2: Using Docker

1. Build the Docker image:

    ```bash
    docker build -t walkinonline .
    ```

2. Run the Docker container:

    ```bash
    docker run -p 3000:3000 walkinonline
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

walkinonline/
├── app/ # Next.js 13 app directory
├── components/ # Reusable React components
├── config/ # Configuration files
│ ├── contents.ts # Website content
│ ├── settings.ts # Site settings
│ └── site.ts # Site-wide information
├── public/ # Static assets
└── types/ # TypeScript type definitions


## Features

- AI-powered queue estimation
- Real-time notifications
- User feedback system
- Appointment scheduling
- Shop owner dashboard
- Barber management
- Service management
- Dark/Light theme support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Authentication

The application uses **NextAuth.js** for authentication. Available roles:
- **Shop Owner**
- **Customer**
- **Barber**

## Configuration

You can customize the website by modifying the following files:
- `config/contents.ts` - Manage website content
- `config/settings.ts` - Modify site settings
- `config/site.ts` - Update site-wide information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


# Configure the website

This folder contains essential configuration files used to modify the contents and settings of the website.

- contents.ts: Manage the content displayed on the website.
- settings.ts: Customize various settings, such as disabling theme toggle.
- site.ts: Contains general site-wide information.

```ts
export const siteConfig: SiteConfig = {
  name: "WalkInOnline",
  author: "Fawad",
  description:
    "WalkInOnline: A streamlined, AI-powered queue and appointment management platform for barbershops, enabling real-time wait time estimates, service selection, and appointment booking, built with Next.js and shadcn/ui.",
keywords: [
    "Barbershop Queue Management",
    "Appointment Scheduling",
    "Real-Time Wait Times",
    "Service Selection",
    "Customer Check-In",
    "Feedback and Ratings",
    "Barber Performance Tracking",
    "Shop Owner Dashboard",
    "Barber Scheduling",
    "Queue Position Tracking",
    "Appointment Reminders",
    "Customer Engagement",
    "AI Wait Time Prediction",
    "Shop Analytics",
    "User-Friendly Experience",
    "Real-Time Notifications",
    "Appointment Rescheduling",
    "Customer Service Feedback",
    "Performance Reports"
  ],
  url: {
    base: baseUrl,
    author: "https://walkinonline.com",
  },
  ogImage: `${baseUrl}/og.jpg`,
}
```
