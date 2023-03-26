import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { auth } from "~/firebase/index";

function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Sign Out</Button>
  );
}

const Home: NextPage = () => {
  return <SignOut />;
};

export default Home;
