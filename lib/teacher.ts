/* export const isTeacher = (userId?: string | null) => {
  return process.env.NEXT_PUBLIC_TEACHER_ID.includes(userId);
} */

// Import des Prisma-Clients, der in der Datei prismaClient.ts definiert ist
import prisma from './prismaClient';

// Funktion, die prüft, ob ein Benutzer ein teacher/admin ist
// async, da die Funktion auf die Datenbankabfrage warten muss
export const isTeacher = async (userId) => {
  try {
    // Nutze $quereRaw von Prisma, um eine SQL-Abfrage auszuführen
    // das Ergebnis ist ein Array von Objekten, welches als result gespeichert wird
    // Beispiel: [{ is_teacher: true }]
    const result = await prisma.$queryRaw`SELECT public.is_teacher(${userId}) AS is_teacher`;
    // Gib den Wert des is_teacher Feldes des ersten Objekts zurück
    return result[0]?.is_teacher;
  } catch (error) {
    console.error('Fehler beim Aufrufen der is_teacher Funktion:', error);
    return false;
  }
};

