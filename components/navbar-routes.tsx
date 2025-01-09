"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const [isUserTeacher, setIsUserTeacher] = useState<boolean | null>(null); // Status des Lehrers
  const [isLoading, setIsLoading] = useState(true); // Ladezustand

  useEffect(() => {
    const fetchTeacherStatus = async () => {
      if (userId) {
        console.log("Fetching teacher status for userId:", userId);
        setIsLoading(true);
        try {
          const teacherStatus = await isTeacher(userId);
          console.log("Teacher status fetched:", teacherStatus);
          setIsUserTeacher(teacherStatus);
        } catch (error) {
          console.error("Error fetching teacher status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No userId available.");
        setIsUserTeacher(false);
        setIsLoading(false);
      }
    };

    fetchTeacherStatus();
  }, [userId]);

  if (!userId) {
    console.log("User not logged in or userId not available.");
    return null;
  }

  if (isLoading) {
    return <div>Laden...</div>;
  }

return (
  <>
    {isSearchPage && (
      <div className="hidden md:block">
        <SearchInput />
      </div>
    )}
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isCoursePage ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </Link>
      ) : isUserTeacher === true ? (
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
