"use client";

import { Quiz } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const columns: ColumnDef<Quiz>[] = [
  {
    accessorKey: "quiz_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "questions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Questions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // TODO: Wir haben noch kein Questions Feld in der Datenbank, deswegen wird hier ein Dummy-Wert verwendet
      // const questions = parseFloat(row.getValue("questions") || "0");
      const questions = 0;

      return <div>{questions}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          updated at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // updatedAt ist ein String, deswegen wird hier ein Datum-Objekt erstellt
      const updatedAtString = row.getValue("updatedAt") as string;
      // Wenn updatedAtString nicht existiert, wird "Ungültiges Datum" zurückgegeben
      const updatedAt = updatedAtString
        ? new Date(updatedAtString).toLocaleDateString("de-DE")
        : "Ungültiges Datum";
      /*const updatedAt =
        row.getValue("updatedAt").toLocaleDateString("de-DE") || false;*/

      return <div>{updatedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { quiz_id } = row.original;

      //TODO: refresh/reload/unmount after delete ??
      /*
      const [isLoading, setIsLoading] = useState(false);

      const onDelete = async () => {
        try {
          setIsLoading(true);
          await axios.delete(`/api/quizzes/${quiz_id}/actions/delete`);

          toast.success("Quiz deleted");
        } catch {
          toast.error("Something went wrong");
        } finally {
          setIsLoading(false);
        }
      };*/

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/quizzes/${quiz_id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
            </Link>
            {/*
            <ConfirmModal onConfirm={onDelete}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash className="h-4 w-4 mr-2" />
                löschen
              </DropdownMenuItem>
            </ConfirmModal>
            */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
