import { Button } from "@mantine/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { auth } from "~/firebase/index";
import { userCollection } from "~/firebase/collections";

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
        gmail: user.user.email,
        avatar: user.user.photoURL,
        name: user.user.displayName,
      });
      console.log({ resultRef });
    }
  };
  return <Button onClick={signInWithGoogle}>Sign In</Button>;
};

export default SignIn;
