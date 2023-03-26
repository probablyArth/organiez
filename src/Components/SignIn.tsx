import { Button } from "@mantine/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { auth } from "~/firebase/index";
import { userCollection } from "~/firebase/collections";
import { v4 } from "uuid";

const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    const data = await getDocs(
      query(userCollection, where("uid", "==", user.user.uid))
    );

    if (data.empty) {
      const resultRef = await addDoc(userCollection, {
        uid: user.user.uid,
        gmail: user.user.email as string,
        avatar: user.user.photoURL as string,
        name: user.user.displayName as string,
        id: v4(),
      });
    }
  };
  return <Button onClick={signInWithGoogle}>Sign In</Button>;
};

export default SignIn;
