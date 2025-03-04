"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface UpdateButtonProps {
  users: User[];
  clerkUsers: any;
}

export const UpdateButtonComponent = ({
  users,
  clerkUsers,
}: UpdateButtonProps) => {
  const updateUsers = async () => {
    clerkUsers.forEach(async (user: any) => {
      const newUser = {
        user_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        last_signed_in: new Date(user.lastSignInAt),
      };
      if (users.find((u) => u.user_id === newUser.user_id)) {
        return;
      }
      try {
        await axios.post("/api/users", newUser);
        toast.success("User created");
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error creating user entry:", error);
      }
    });
  };

  return <Button onClick={updateUsers}>Update Users</Button>;
};
