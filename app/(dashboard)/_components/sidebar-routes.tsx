"use client";

import {
  BarChart,
  Compass,
  Layout,
  List,
  Trophy,
  BookOpenCheck,
  Users,
  PawPrint,
  HeartHandshake,
  Footprints,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { User } from "@prisma/client";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  //{
  //  icon: Trophy,
  //  label: "Ränge",
  //  href: "/rank",
  //},
  // {
  //   icon: Compass,
  //   label: "Browse",
  //   href: "/search",
  // },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BookOpenCheck,
    label: "Quizzes",
    href: "/teacher/quizzes",
  },
  {
    icon: Users,
    label: "Users",
    href: "/teacher/users",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

interface SidebarRouteProbs {
  user: User | null;
}

export const SidebarRoutes = ({ user }: SidebarRouteProbs) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const userRole = user?.user_role;

  const guestRouteLabels = guestRoutes.map((route) => route.label);

  if (
    userRole?.includes("BETREUER") &&
    !guestRouteLabels.includes("Betreuer")
  ) {
    guestRoutes.push({
      icon: PawPrint,
      label: "Betreuer",
      href: "/betreuer",
    });
  }
  if (userRole?.includes("BERATER") && !guestRouteLabels.includes("Berater")) {
    guestRoutes.push({
      icon: HeartHandshake,
      label: "Berater",
      href: "/berater",
    });
  }
  if (
    userRole?.includes("EVENTLEITER") &&
    !guestRouteLabels.includes("Eventleiter")
  ) {
    guestRoutes.push({
      icon: Footprints,
      label: "Eventleiter",
      href: "/eventleiter",
    });
  }
  if (
    userRole?.includes("AFFILIATE") &&
    !guestRouteLabels.includes("Affiliate")
  ) {
    guestRoutes.push({
      icon: Sparkles,
      label: "Affiliate",
      href: "/affiliate",
    });
  }

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
