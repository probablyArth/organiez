import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "~/firebase/index";
import LoadingSpinner from "~/Components/LoadingSpinner";
import SignIn from "~/Components/SignIn";
import { MantineProvider } from "@mantine/core";
import { createContext, useState } from "react";
import { getDocs, query, where } from "firebase/firestore";
import { userCollection } from "~/firebase/collections";
import { ModalsProvider } from "@mantine/modals";

interface IAuthContext {
  userId: string | null;
}

export const AuthContext = createContext<IAuthContext>({
  userId: null,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [user, loading, error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (user) {
        const data = await getDocs(
          query(userCollection, where("uid", "==", user.uid))
        );
        if (data.docs[0]) setUid(data.docs[0].data().uid);
      }
    },
  });

  if (loading) return <LoadingSpinner />;
  if (!user) return <SignIn />;
  return (
    <AuthContext.Provider value={{ userId: uid }}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <ModalsProvider>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </AuthContext.Provider>
  );
};

export default MyApp;
