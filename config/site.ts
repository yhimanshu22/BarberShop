import { SiteConfig, ContactConfig } from "@/types"

/* ====================
[> WEBSITE CONFIG <]
-- Fill the details about your website
 ==================== */

const baseUrl = "https://walkinonline.com"

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

export const contactConfig: ContactConfig = {
  email: "fawad_12@outlook.com",
}
