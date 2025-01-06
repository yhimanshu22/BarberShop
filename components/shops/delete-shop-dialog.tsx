"use client";

import { useState } from "react";
import { getSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteShopDialogProps {
  shopId: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteShopDialog({
  shopId,
  shopName,
  isOpen,
  onClose,
  onDelete,
}: DeleteShopDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const session = await getSession();

      if (!session?.user?.accessToken) {
        toast.error("No access token found. Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete shop");
      }

      toast.success("Shop deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete shop");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Shop</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{shopName}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 