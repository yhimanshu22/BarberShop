"use client";

import Link from "next/link";
import HeadingText from "@/components/heading-text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="container space-y-8 py-12 text-center lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <HeadingText subtext="Join thousands of successful barbershops using WalkInOnline">
            Ready to Transform Your Barbershop?
          </HeadingText>
        </motion.div>
        <motion.p
          className="mx-auto max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Start managing your queues efficiently and provide a better
          experience for your customers.
        </motion.p>
        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-[200px] text-lg font-semibold"
            )}
          >
            Register Your Shop
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-w-[200px] text-lg font-semibold"
            )}
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
