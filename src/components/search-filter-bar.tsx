"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search, SlidersHorizontal, LocateFixed } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from './ui/label';
import { Slider } from './ui/slider';

export interface SearchFilters {
  keyword: string;
  date?: Date;
  proximity?: number; // in km, for example
}

interface SearchFilterBarProps {
  onSearch: (filters: SearchFilters) => void;
  isSearchingLocation: boolean;
  onGetCurrentLocation: () => void;
}

export function SearchFilterBar({ onSearch, isSearchingLocation, onGetCurrentLocation }: SearchFilterBarProps) {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [proximity, setProximity] = useState<number>(10); // Default 10km
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch({ keyword, date, proximity });
    setIsFilterOpen(false); // Close popover on search
  };

  const handleResetFilters = () => {
    setDate(undefined);
    setProximity(10);
    // Optionally reset keyword as well, or keep it
    // setKeyword('');
    // Trigger search with reset filters immediately
    onSearch({ keyword, date: undefined, proximity: 10 });
    setIsFilterOpen(false);
  }

  return (
    <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search Input */}
        <div className="flex-grow">
          <Label htmlFor="search-keyword">Keyword Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-keyword"
              type="search"
              placeholder="Search by title or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Popover Trigger */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Refine your search results.
                </p>
              </div>
              <div className="grid gap-2">
                {/* Date Filter */}
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label htmlFor="filter-date">Date Lost/Found (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="filter-date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(d) => d > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Proximity Filter */}
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label htmlFor="filter-proximity">Proximity (km)</Label>
                   <div className="flex items-center gap-2">
                     <Slider
                       id="filter-proximity"
                       min={1}
                       max={50}
                       step={1}
                       value={[proximity]}
                       onValueChange={(value) => setProximity(value[0])}
                       className="flex-grow"
                     />
                      <span className="w-10 text-right text-sm font-medium">{proximity}km</span>
                   </div>

                 <Button
                    variant="outline"
                    size="sm"
                    onClick={onGetCurrentLocation}
                    disabled={isSearchingLocation}
                    className="mt-2"
                 >
                    <LocateFixed className="mr-2 h-4 w-4" />
                    {isSearchingLocation ? 'Getting Location...' : 'Use Current Location'}
                  </Button>
                </div>
              </div>
               <div className="flex justify-end gap-2 pt-4">
                 <Button variant="ghost" size="sm" onClick={handleResetFilters}>Reset</Button>
                 <Button size="sm" onClick={handleSearch} className="bg-primary hover:bg-primary/90">Apply Filters</Button>
               </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90 md:w-auto">
          Search
        </Button>
      </div>
    </div>
  );
}
