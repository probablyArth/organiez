import { or, query, where } from "firebase/firestore";
import { type NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "~/components/Header";
import { eventCollection } from "~/firebase/collections";
import { AuthContext } from "./_app";
import LoadingSpinner from "~/components/LoadingSpinner";
import { type IEvent } from "~/firebase/interfaces";
import Event from "~/components/Event";
import Head from "next/head";
import { Text } from "@mantine/core";

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);
  const q = query(
    eventCollection,
    or(
      where("creatorId", "==", user?.id),
      where("members", "array-contains", user?.id)
    )
  );
  const [events, loading, error] = useCollectionData(q);
  const [currEvent, setCurrEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && events?.length && events.length > 0) {
      setCurrEvent("0");
    }
  }, [loading, events?.length]);

  if (!events || loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {error && (
        <Text fz={"md"} color="red">
          {error.message}
        </Text>
      )}
      <Head>
        <title>Organiez</title>
      </Head>
      <div className="relative flex h-screen w-screen flex-col">
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
    </>
  );
};

export default Dashboard;
