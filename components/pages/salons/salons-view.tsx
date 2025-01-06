"use client";

import { useState, useEffect } from "react";
import { getSalons } from "@/lib/services/salonService";
import SalonSearch from "@/components/pages/salons/salon-search";
import SalonList from "@/components/pages/salons/salon-list";
import { motion } from "framer-motion";
import { Salon } from "@/types/salon";

export default function SalonsView() {
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
  });
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setIsLoading(true);
        const data = await getSalons(searchParams);
        setSalons(data);
      } catch (error) {
        console.error('Error fetching salons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalons();
  }, [searchParams]);

  return (
    <section className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-center">All Available Salons</h1>
        <p className="text-center text-muted-foreground">
          Find the best salons around you and get a haircut at your convenience.
        </p>
        
        <SalonSearch onSearch={setSearchParams} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Salons Near You</h2>
          <SalonList salons={salons} isLoading={isLoading} />
        </div>
      </motion.div>
    </section>
  );
} 