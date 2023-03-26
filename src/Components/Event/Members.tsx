import { Avatar, Button, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FC, useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { eventCollection, userCollection } from "~/firebase/collections";
import { IUser } from "~/firebase/interfaces";
import { EventContext } from ".";

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
    updateDoc(eventDoc, { members: [...membersList, docs.docs[0]?.data().id] });
    modals.closeAll();
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values.email))}>
      <TextInput label="Member email" {...form.getInputProps("email")} />
    </form>
  );
};

const MemberCard: FC<{ member: IUser }> = ({ member }) => {
  return (
    <Paper
      shadow="sm"
      p={"lg"}
      className="flex h-[80px] w-full items-center gap-4"
    >
      <Avatar src={member.avatar} />
      <div className="flex flex-col">
        <Text fw={700}>{member.name}</Text>
        <Text color="blue">{member.gmail}</Text>
      </div>
    </Paper>
  );
};

const Members: FC = () => {
  const { ROLE, event } = useContext(EventContext);
  let q = null;
  if (event.members.length > 0) {
    q = query(userCollection, where("id", "in", event.members));
  }
  const [members] = useCollection(q);

  return (
    <>
      {ROLE === "CREATOR" && (
        <Button
          onClick={() => {
            modals.open({
              title: "Add a member",
              children: (
                <AddMemberModal
                  eventId={event.id}
                  membersList={event.members}
                />
              ),
            });
          }}
        >
          Add a member
        </Button>
      )}
      {members?.docs.map((doc, idx) => {
        return <MemberCard member={doc.data()} key={idx} />;
      })}
    </>
  );
};

export default Members;
