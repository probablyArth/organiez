import { collection } from "firebase/firestore";
import { db } from "~/firebase";

export const userCollection = collection(db, "user");
export const eventCollection = collection(db, "event");
