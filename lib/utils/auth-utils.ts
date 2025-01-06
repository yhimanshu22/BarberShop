import { signOut } from "next-auth/react";
import { toast } from "sonner";

export async function handleUnauthorizedResponse() {
  toast.error("Session expired. Please login again.");
  await signOut({ redirect: true, callbackUrl: "/" });
} 