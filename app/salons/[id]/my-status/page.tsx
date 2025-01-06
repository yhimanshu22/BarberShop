"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface QueueStatus {
  position: number;
  estimated_wait_time: number;
  status: string;
  checked_in_at: string;
  full_name: string;
  barber_name?: string;
  service_name?: string;
}

export default function MyStatusPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkInPhone = localStorage.getItem('checkInPhone');
    const checkInShopId = localStorage.getItem('checkInShopId');

    // Redirect if no check-in data or wrong salon
    if (!checkInPhone || checkInShopId !== params.id) {
      router.push(`/salons/${params.id}`);
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/queue/check-status?phone=${checkInPhone}&shop_id=${params.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch status');
        }

        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-pulse">Loading status...</div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="container py-8 text-center">
        <div className="text-red-500">{error || 'Status not found'}</div>
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
      <Card className="p-8 max-w-2xl mx-auto shadow-lg rounded-lg">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Queue Status</h1>
            <p className="text-muted-foreground">
              Welcome, {status.full_name}
            </p>
          </div>

          <div className="grid gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Current Position</h3>
                    <p className="text-3xl font-bold text-primary">
                      #{status.position}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estimated Wait</p>
                  <p className="text-2xl font-semibold">
                    {status.estimated_wait_time} mins
                  </p>
                </div>
              </div>
            </Card>

            {(status.barber_name || status.service_name) && (
              <Card className="p-6">
                <div className="space-y-4">
                  {status.barber_name && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Barber</p>
                        <p className="font-medium">{status.barber_name}</p>
                      </div>
                    </div>
                  )}
                  {status.service_name && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Service</p>
                        <p className="font-medium">{status.service_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                localStorage.removeItem('checkInPhone');
                localStorage.removeItem('checkInShopId');
                router.push(`/salons/${params.id}`);
              }}
            >
              Leave Queue
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 