"use client";

import HeadingText from "@/components/heading-text";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    number: "500+",
    label: "Barbershops",
  },
  {
    number: "50k+",
    label: "Happy Customers",
  },
  {
    number: "1M+",
    label: "Queue Entries",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="container py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="text-4xl lg:text-5xl font-bold text-primary">
                {stat.number}
              </p>
              <p className="text-lg text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
