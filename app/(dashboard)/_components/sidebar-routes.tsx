"use client";

import {
  BarChart,
  Compass,
  Layout,
  List,
  Trophy,
  BookOpenCheck,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Trophy,
    label: "Ränge",
    href: "/rank",
  },
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

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

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
