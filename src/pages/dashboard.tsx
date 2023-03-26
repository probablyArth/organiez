import { or, query, where } from "firebase/firestore";
import { type NextPage } from "next";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "~/Components/Header";
import { eventCollection } from "~/firebase/collections";
import { AuthContext } from "./_app";
import LoadingSpinner from "~/Components/LoadingSpinner";

const Dashboard: NextPage = () => {
  const { userId } = useContext(AuthContext);
  const q = query(
    eventCollection,
    or(
      where("creatorId", "==", userId),
      where("membersIds", "array-contains", userId)
    )
  );
  const [events] = useCollectionData(q);
  console.log({ events });
  if (!events) {
    return <LoadingSpinner />;
  }
  return (
    <div className="h-screen w-screen">
      <Header events={events} />
    </div>
  );
};

export default Dashboard;
