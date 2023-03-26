import { DocumentData, or, query, where } from "firebase/firestore";
import { type NextPage } from "next";
import { useContext, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "~/Components/Header";
import { eventCollection } from "~/firebase/collections";
import { AuthContext } from "./_app";
import LoadingSpinner from "~/Components/LoadingSpinner";
import { IEvent } from "~/firebase/interfaces";
import Event from "~/Components/Event";

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);
  const q = query(
    eventCollection,
    or(
      where("creatorId", "==", user?.id),
      where("membersIds", "array-contains", user?.id)
    )
  );
  const events = useCollectionData(q)[0] as IEvent[];
  const [currEvent, setCurrEvent] = useState<string | null>(null);
  if (!events) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header
        events={events}
        setCurrEvent={setCurrEvent}
        currEvent={currEvent}
      />
      {events.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          Start by creating an event
        </div>
      )}
      {events.length > 0 && currEvent === null && (
        <div className="flex h-full w-full items-center justify-center">
          Start by selecting an event
        </div>
      )}
      {events.length > 0 && currEvent !== null && (
        <Event event={events[parseInt(currEvent)] as IEvent} />
      )}
    </div>
  );
};

export default Dashboard;
