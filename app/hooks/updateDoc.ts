import { db } from "@/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { DailyGoal, Log } from "../types/types";

type userDocType = {
  uid: string;
  email?: string | null;
  username?: string;
  lastActive?: string;
};

export const setUserInfo = async ({
  uid,
  email,
  username,
  lastActive,
}: userDocType) => {
  const userDocRef = doc(db, "users", uid);

  const updateFields: Record<string, any> = {};

  if (email !== undefined) updateFields.email = email;
  if (username !== undefined) updateFields.username = username;
  if (lastActive !== undefined) updateFields.lastActive = lastActive;

  try {
    await updateDoc(userDocRef, updateFields);

    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error setting document:", e);
  }
};
