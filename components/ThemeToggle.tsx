"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex">
      <button onClick={toggleTheme} className="p-2">
        {isDarkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};

export default ThemeToggle;
