import { Button, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { EventContext } from "../index";
import StatsCard from "./StatsCard";
import { RxExit } from "react-icons/rx";
import { modals } from "@mantine/modals";
import {
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { eventCollection } from "~/firebase/collections";
import { IEvent } from "~/firebase/interfaces";
import { AuthContext } from "~/pages/_app";
import { notifications } from "@mantine/notifications";

const leaveEvent = async (eventId: string, userId: string) => {
  const q = await getDocs(query(eventCollection, where("id", "==", eventId)));
  const eventDoc = q.docs[0]?.data() as IEvent;
  eventDoc.members.splice(eventDoc.members.indexOf(userId), 1);

  const eventRef = doc(eventCollection, q.docs[0]?.id);
  await updateDoc(eventRef, { members: eventDoc.members });
};

const Overview = () => {
  const { event, ROLE } = useContext(EventContext);
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="flex items-center gap-4">
        <Title>
          <mark className="inline-block bg-blue-300 pb-[20px] leading-[0]">
            {event.title}
          </mark>
        </Title>
        {ROLE === "MEMBER" && (
          <Button
            rightIcon={<RxExit />}
            color="red"
            onClick={() => {
              modals.openConfirmModal({
                title: `Leave ${event.title}?`,
                onConfirm: async () => {
                  try {
                    await leaveEvent(event.id, user?.id as string);
                  } catch (e) {
                    notifications.show({
                      message: "An error occurred!",
                      color: "red",
                    });
                    console.log({ e });
                  }
                },
                labels: {
                  confirm: "Yes",
                  cancel: "No, Im backing off",
                },
              });
            }}
          >
            Leave
          </Button>
        )}
      </div>
      <Text fz={"sm"}>{event.description}</Text>
      <StatsCard />
    </>
  );
};

export default Overview;
