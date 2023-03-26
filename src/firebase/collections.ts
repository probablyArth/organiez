import { CollectionReference, collection } from "firebase/firestore";
import { db } from "~/firebase";
import { IEvent, ITask, IUser } from "./interfaces";

export const userCollection = collection(
  db,
  "user"
) as CollectionReference<IUser>;
export const eventCollection = collection(
  db,
  "event"
) as CollectionReference<IEvent>;
export const taskCollection = collection(
  db,
  "task"
) as CollectionReference<ITask>;
