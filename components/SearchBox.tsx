"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";

type TourResult = {
  id: string;
  name: string;
};

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TourResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search-tours?q=${encodeURIComponent(searchTerm)}`);
      const data: TourResult[] = await res.json();
      setResults(data);
      setOpen(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setResults([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchResults, 300);

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full p-1 md:w-[400px]">
      <div className="mt-4 flex gap-x-2 items-center bg-white px-2 py-1 rounded-full shadow-md w-full md:w-[400px]">
        <Search className="bg-[#4BC8B0] text-white text-sm p-1.5 rounded-full" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm tour..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(results.length > 0 || query.trim().length > 0)}
          className="flex-1 text-black bg-transparent !ring-0 !outline-none !focus:ring-0 !focus:outline-none !border-none !shadow-none"
        />
      </div>

      {open && (
        <Command
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 p-2 w-full max-h-[200px] h-auto overflow-y-auto bg-white shadow-lg rounded-lg z-50"
        >
          <CommandList>
            <CommandGroup>
              {loading ? (
                <CommandItem disabled>Đang tìm kiếm...</CommandItem>
              ) : results.length > 0 ? (
                results.map((tour) => (
                  <CommandItem key={tour.id} onSelect={() => setOpen(false)}>
                    <Link href={`/tour/${tour.id}`} className="w-full block">
                      {tour.name}
                    </Link>
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>Không tìm thấy tour nào</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
};

export default SearchBox;
