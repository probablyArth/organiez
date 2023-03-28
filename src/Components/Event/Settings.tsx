import { Button, Text } from "@mantine/core";
import { useContext } from "react";
import { EventContext } from ".";
import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { eventCollection } from "~/firebase/collections";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

const deleteEvent = async (eventId: string) => {
  try {
    const eventDoc = doc(
      eventCollection,
      (await getDocs(query(eventCollection, where("id", "==", eventId))))
        .docs[0]?.id
    );
    return deleteDoc(eventDoc);
  } catch (e) {
    notifications.show({ message: "An error occurred!", color: "red" });
  }
};

const Settings = () => {
  const { event } = useContext(EventContext);
  const router = useRouter();
  return (
    <Button
      color="red"
      onClick={() => {
        modals.openConfirmModal({
          title: `Confirm delete event ${event.title}`,
          children: <Text>Are you sure?</Text>,
          onConfirm: () => {
            deleteEvent(event.id).then(() => {
              router.reload();
              notifications.show({ message: "Success!", color: "green" });
            });
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
