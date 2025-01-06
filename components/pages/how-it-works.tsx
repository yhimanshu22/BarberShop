"use client";

import { Icons } from "@/components/icons";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "1",
    title: "Find a Shop",
    description: "Browse nearby barbershops and check wait times",
    icon: "search",
  },
  {
    number: "2",
    title: "Check In",
    description: "Join the queue or book an appointment",
    icon: "checkCircle",
  },
  {
    number: "3",
    title: "Get Updates",
    description: "Receive real-time notifications about your status",
    icon: "bell",
  },
  {
    number: "4",
    title: "Get Your Cut",
    description: "Show up when it's your turn and skip the wait",
    icon: "scissors",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="container py-12 lg:py-20" ref={ref}>
      <motion.h2
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        How It Works
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = Icons[step.icon as keyof typeof Icons];
          return (
            <motion.div
              key={step.number}
              className="flex flex-col items-center text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative">
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <Icon className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
