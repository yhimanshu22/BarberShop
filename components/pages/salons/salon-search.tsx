"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SalonSearchProps {
  onSearch: (params: { query: string; location: string }) => void;
}

export default function SalonSearch({ onSearch }: SalonSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch({ query, location: "" });
  };

  return (
    <div className="flex gap-2 max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Search by name, address, city, or state"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1"
      />
      <Button 
        onClick={handleSearch}
        className="bg-primary"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
} 