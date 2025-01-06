import { HeroHeader, ContentSection } from "@/types/contents"


export const heroHeader: HeroHeader = {
  header: `Never Wait in Line Again`,
  subheader: `Join WalkInOnline and enjoy seamless booking at your favorite barbershop.`,
  image: `/queue-management-system.png`,
}

export const featureCards: ContentSection = {
  header: `Powered by`,
  subheader: `AI Technologies that Drive WalkInOnline for a Better Experience`,
  content: [
    {
      text: `AI Queue Estimation`,
      subtext: `Accurate wait times powered by machine learning`,
      icon: "brain",
    },
    {
      text: `Real-Time Notifications`,
      subtext: `Instant updates for bookings and queue status`,
      icon: "bell",
    },
    {
      text: `User Feedback System`,
      subtext: `Rate and review services for better experiences`,
      icon: "star",
    },
  ],
}

export const features: ContentSection = {
  header: `Features`,
  subheader: `Why Choose WalkInOnline?`,
  image: `/screenshot.png`,
  content: [
    {
      text: `Seamless Check-In`,
      subtext: `Join the queue remotely and track your position in real-time`,
      icon: "qrcode",
    },
    {
      text: `Appointment Scheduling`,
      subtext: `Book services with your favorite barber at a time that suits you`,
      icon: "calendar",
    },
    {
      text: `Performance Insights`,
      subtext: `Shop owners and barbers get insights on customer engagement and service quality`,
      icon: "chartLine",
    },
  ],
}
