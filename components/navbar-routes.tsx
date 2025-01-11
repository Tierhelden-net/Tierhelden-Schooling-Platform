/* "use client";

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
}; */

/* "use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
//import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";

//import ThemeToggle from "@/components/ThemeToggle";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacher = true; 

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

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
        ) : isTeacher ? (
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
 */

"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { SearchInput } from "./search-input";

import ThemeToggle from "@/components/ThemeToggle";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  // setIsAdmin ist eine Funktion, die den Wert von isAdmin in der React Komponente ändert
  // Initialer Wert von isAdmin ist false
  const [isAdmin, setIsAdmin] = useState(false);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  // useEffect: Der erste Parameter ist die Funktion, die ausgeführt wird, wenn die Abhängigkeiten sich ändern.
  // Der zweite Parameter ist ein Array von Abhängigkeiten, die überwacht werden sollen (in diesem Fall userId).
  useEffect(() => {
    // async-Funktion, die die Benutzerrolle abruft und innerhalb von UseEffect definiert ist
    // async-Funktion, da wir auf die Antwort des Servers/der Datenbank warten müssen
    const fetchUserRole = async () => {
      if (!userId) return;

      try {
        // Verwende fetch, um eine Anfrage an den Server zu senden
        // Nutze await, da wir auf die Antwort des Servers warten müssen
        const response = await fetch(`/api/isTeacher`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // mit response.json() wird die Antwort in Java-Script Objekt umgewandelt
        const isAdminResponse = await response.json();
        setIsAdmin(isAdminResponse === true);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, [userId]);

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
