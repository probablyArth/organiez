import { Button, Text } from "@mantine/core";
import { useContext } from "react";
import { EventContext } from ".";
import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { eventCollection } from "~/firebase/collections";
import { modals } from "@mantine/modals";

const deleteEvent = async (eventId: string) => {
  const eventDoc = doc(
    eventCollection,
    (await getDocs(query(eventCollection, where("id", "==", eventId)))).docs[0]
      ?.id
  );
  await deleteDoc(eventDoc);
};

const Settings = () => {
  const { event } = useContext(EventContext);

  return (
    <Button
      color="red"
      onClick={() => {
        modals.openConfirmModal({
          title: `Confirm delete event ${event.title}`,
          children: <Text>Are you sure?</Text>,
          onConfirm: () => {
            deleteEvent(event.id);
          },
          labels: { confirm: "Confirm", cancel: "Cancel" },
        });
      }}
    >
      Delete Event
    </Button>
  );
};

export default Settings;
