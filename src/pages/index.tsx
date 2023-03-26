import { Button } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import SignIn from "~/Components/SignIn";
import { auth } from "~/firebase/index";

function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Sign Out</Button>
  );
}

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Organiez</title>
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center font-DM">
        <h1 className="text-8xl font-extrabold">Organiez</h1>
        <p>
          EZily organise events by distributing and managing tasks among your
          peers :)
        </p>
        <div className="flex gap-4">
          {auth.currentUser && (
            <Button
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Dashboard
            </Button>
          )}
          <SignOut />
          {auth.currentUser === null && <SignIn />}
        </div>
      </div>
    </>
  );
};

export default Home;
