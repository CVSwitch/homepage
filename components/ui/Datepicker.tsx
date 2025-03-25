"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useEffect } from "react";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  startYear?: number;
  endYear?: number;
  disabled?: boolean;
}
export function DatePicker({
  value,
  onChange,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Ensure the date is stored in local time without timezone shifts
      const localDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      const formattedDate = `${localDate.getFullYear()}-${String(
        localDate.getMonth() + 1
      ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

      setDate(localDate);
      onChange?.(formattedDate as unknown as Date);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-inherit" : ""
          }`}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault(); 
              return;
            }
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
