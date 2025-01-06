"use client";

import Image from "next/image";
import HeadingText from "@/components/heading-text";
import { featureCards } from "@/config/contents";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FeatureCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="container space-y-8 py-12 text-center lg:py-20">
        {featureCards.header || featureCards.subheader ? (
          <HeadingText subtext={featureCards.subheader}>
            {featureCards.header}
          </HeadingText>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featureCards.content.map((cards, index) => {
            const Icon = Icons[cards.icon || "blank"];

            return (
              <motion.div
                key={cards.text}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="flex flex-grow flex-col items-center justify-between gap-4 p-8 dark:bg-secondary">
                  <div className="flex">
                    <Icon className="h-[6rem] w-[6rem]" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle>{cards.text}</CardTitle>
                    <CardDescription>{cards.subtext}</CardDescription>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
