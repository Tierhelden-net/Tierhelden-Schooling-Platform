"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
// Entferne den alten isTeacher Import
// import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";

// import ThemeToggle from "@/components/ThemeToggle";

// Importiere die neue isTeacher Funktion
import { useEffect, useState } from "react";
import { isTeacher as checkIfTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherStatus = async () => {
      if (!userId) {
        setIsTeacher(false);
        setLoading(false);
        return;
      }

      try {
        const teacherStatus = await checkIfTeacher(userId);
        setIsTeacher(teacherStatus);
      } catch (err) {
        console.error("Fehler beim Überprüfen des Lehrerstatus:", err);
        setError("Ein Fehler ist aufgetreten.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherStatus();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-between">
        {/* Hier kannst du einen ansprechenden Ladeindikator einfügen */}
        <p>Lade...</p>
      </div>
    );
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
        ) : isTeacher ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Admin-Bereich
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
      {error && <p className="text-red-500">Fehler: {error}</p>}
    </>
  );
};
