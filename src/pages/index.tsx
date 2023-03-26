import { Button } from "@mantine/core";
import { type NextPage } from "next";
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
    <div>
      Hi
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
      <SignIn />
    </div>
  );
};

export default Home;
