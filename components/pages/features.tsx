"use client";

import Image from "next/image";
import HeadingText from "@/components/heading-text";
import { features } from "@/config/contents";
import { Icons } from "@/components/icons";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="container space-y-8 py-12 lg:py-20" id="features" ref={ref}>
      {features.header || features.subheader ? (
        <HeadingText subtext={features.subheader} className="text-center">
          {features.header}
        </HeadingText>
      ) : null}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-8">
          {features.content.map((cards, index) => {
            const Icon = Icons[cards.icon || "blank"];

            return (
              <motion.div
                key={cards.text}
                className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-8 md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex">
                  <Icon className="h-[6rem] w-[6rem]" />
                </div>
                <div className="flex-1">
                  <p className="md:text-4xl text-2xl font-semibold">
                    {cards.text}
                  </p>
                  <p className="font-light text-muted-foreground md:text-lg">
                    {cards.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          className="md:border"
          style={{
            backgroundImage: `url(${features.image})`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `cover`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        ></motion.div>
      </div>
    </section>
  );
}
