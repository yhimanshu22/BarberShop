"use client";

import { useEffect, useState } from "react";
import { getSalonDetails } from "@/lib/services/salonService";
import { Card } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface QueueItem {
  id: number;
  position_in_queue: number;
  full_name: string;
  status: "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED";
  check_in_time: string;
  service_start_time: string | null;
  number_of_people: number;
  barber_id: number | null;
  service_id: number | null;
}

interface SalonDetails {
  id: number;
  name: string;
  formatted_hours: string;
  is_open: boolean;
  estimated_wait_time: number;
}

export default function QueuePage({ params }: { params: { id: string } }) {
  const [salon, setSalon] = useState<SalonDetails | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch salon details
        const salonData = await getSalonDetails(params.id);
        setSalon(salonData);

        // Fetch queue data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch queue data');
        const queueData = await response.json();
        setQueueItems(queueData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-pulse">Loading queue information...</div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="container py-8 text-center">
        <div className="text-red-500">Salon not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8"
    >
      <Card className="p-8 max-w-3xl mx-auto shadow-lg rounded-lg">
        <div className="space-y-6">
          {/* Salon Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-6 text-primary">{salon.name}</h1>
          </div>

          {/* Status Badge */}
          <div className="border-t pt-6">
            <Card className="p-4 bg-background border-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${salon.is_open ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <Clock className={`h-5 w-5 ${salon.is_open ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${salon.is_open ? 'text-green-500' : 'text-red-500'}`}>
                      {salon.is_open ? 'Currently Open' : 'Currently Closed'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Business Hours: {salon.formatted_hours}
                    </p>
                  </div>
                </div>
                {salon.is_open && (
                  <div className="text-green-500 font-medium">
                    Est. Wait: {salon.estimated_wait_time} mins
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Queue List */}
          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Current Queue</h2>
            {queueItems.length > 0 ? (
              <div className="space-y-4">
                {queueItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Checked in: {new Date(item.check_in_time).toLocaleTimeString()}
                          </p>
                          {item.number_of_people > 1 && (
                            <p className="text-sm text-muted-foreground">
                              Group of {item.number_of_people}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          #{item.position_in_queue}
                        </div>
                        <div className={`text-sm ${
                          item.status === 'IN_PROGRESS' ? 'text-green-500' : 
                          item.status === 'CHECKED_IN' ? 'text-blue-500' : 
                          'text-gray-500'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Current Queue</AlertTitle>
                <AlertDescription>
                  There are currently no customers in the queue.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
