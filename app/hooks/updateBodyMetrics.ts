import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

updateDoc;

type Props = {
  uid: string;
  key: "weight" | "height" | "age";
  value: number;
};

export const updatePersonalInfo = async ({ uid, key, value }: Props) => {
  if (!uid) return;

  const userDocRef = doc(db, "users", uid);

  try {
    await updateDoc(userDocRef, {
      [`bodyMetrics.${key}`]: value,
    });
    console.log("Body metrics updated successfully!");
  } catch (e) {
    console.error("Error updating body metrics:", e);
  }
};
