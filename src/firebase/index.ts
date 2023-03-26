import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "~/env.mjs";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_apiKey,
  authDomain: env.NEXT_PUBLIC_authDomain,
  projectId: env.NEXT_PUBLIC_projectId,
  storageBucket: env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: env.NEXT_PUBLIC_messagingSenderId,
  appId: env.NEXT_PUBLIC_appId,
  measurementId: env.NEXT_PUBLIC_measurementId,
};

const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);
export const auth = getAuth(app);
