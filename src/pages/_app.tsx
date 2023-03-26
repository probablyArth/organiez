import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "~/firebase/index";
import LoadingSpinner from "~/Components/LoadingSpinner";
import { MantineProvider } from "@mantine/core";
import { createContext, useEffect, useState } from "react";
import { getDocs, query, where } from "firebase/firestore";
import { userCollection } from "~/firebase/collections";
import { ModalsProvider } from "@mantine/modals";
import { type IUser } from "~/firebase/interfaces";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import Home from ".";

interface IAuthContext {
  user: IUser | null;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [fetchedUser, setUser] = useState<IUser | null>(null);
  const [user, loading, error] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (user) {
        const data = await getDocs(
          query(userCollection, where("uid", "==", user.uid))
        );
        if (data.docs[0]) setUser(data.docs[0].data());
      }
    },
  });

  const [actualLoading, setActualLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    console.log({ fetchedUser });
    if (fetchedUser != null && fetchedUser != undefined) {
      setActualLoading(false);
    }
  }, [fetchedUser]);
  if (loading) return <LoadingSpinner />;
  if (!user) return <Home />;
  if (user && actualLoading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ user: fetchedUser }}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          fontFamily: "Roboto",
        }}
      >
        <ModalsProvider>
          <Notifications />
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </AuthContext.Provider>
  );
};

export default MyApp;
