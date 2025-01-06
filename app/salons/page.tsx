import SalonsView from "@/components/pages/salons/salons-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Available Salons",
  description: "Find the best salons around you and get a haircut at your convenience.",
};

export default function SalonsPage() {
  return <SalonsView />;
} 