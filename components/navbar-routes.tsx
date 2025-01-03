"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";
import React, { useState, useEffect } from "react";

import { SearchInput } from "./search-input";

import ThemeToggle from "@/components/ThemeToggle";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      const result = await isTeacher(userId);
      setIsAdmin(result);
    };

    fetchIsAdmin();
  }, [userId]);

  if (isAdmin === null) {
    // noch am Laden...
    return <p>Wird geprüft...</p>;
  }

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div>
        <ThemeToggle />
      </div>
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          </Link>
        ) : isAdmin ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Admin-Bereich
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

////////
