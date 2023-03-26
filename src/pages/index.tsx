import { Button } from "@mantine/core";
import { type NextPage } from "next";
import SignIn from "~/Components/SignIn";
import { auth } from "~/firebase/index";

function SignOut() {
  return (
    auth.currentUser && <Button onClick={() => auth.signOut()}>Sign Out</Button>
  );
}

const Home: NextPage = () => {
  return (
    <div>
      <SignOut />
      <SignIn />
    </div>
  );
};

export default Home;
