/* export const isTeacher = (userId?: string | null) => {
  return process.env.NEXT_PUBLIC_TEACHER_ID.includes(userId);
} */

import { supabase } from "@/lib/supabaseClient";

export const isTeacher = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc("is_teacher", { p_user_id: userId });

    if (error) {
      console.error("Supabase RPC Error:", error);
      throw error;
    }

    console.log("Supabase RPC Result:", data); // Debugging
    return Boolean(data); // Rückgabe als boolean
  } catch (error) {
    console.error("Error in isTeacher function:", error);
    return false;
  }
};


