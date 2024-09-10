import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Import the default styles

const DateRangePicker = ({ onSelect }) => {
  const [range, setRange] = useState({ from: null, to: null });

  const handleSelect = (range) => {
    setRange(range);
    if (onSelect) {
      onSelect(range);
    }
  };

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={handleSelect}
      defaultMonth={new Date()} // Set initial month (September 2024)
    />
  );
};

export default DateRangePicker;
