import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { type FC } from "react";
import { eventCollection, userCollection } from "~/firebase/collections";

const AddMemberModal: FC<{ eventId: string; membersList: string[] }> = ({
  eventId,
  membersList,
}) => {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? null
          : "Invalid email address",
    },
  });

  const handleSubmit = async (email: string) => {
    try {
      const q = query(userCollection, where("gmail", "==", email));
      const docs = await getDocs(q);
      if (docs.empty) {
        form.setFieldError("email", "User not found!");
      }
      const eventDoc = doc(
        eventCollection,
        (await getDocs(query(eventCollection, where("id", "==", eventId))))
          .docs[0]?.id
      );
      await updateDoc(eventDoc, {
        members: [...membersList, docs.docs[0]?.data().id],
      });
      modals.closeAll();
      notifications.show({ message: "Success!", color: "green" });
    } catch (e) {
      notifications.show({ message: "An error occurred!", color: "red" });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        void handleSubmit(values.email);
      })}
      className="flex flex-col gap-4"
    >
      <TextInput label="Member email" {...form.getInputProps("email")} />
      <Button type="submit">Add</Button>
    </form>
  );
};
export default AddMemberModal;
