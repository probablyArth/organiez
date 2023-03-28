import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { query, where } from "firebase/firestore";
import { type FC, useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { userCollection } from "~/firebase/collections";
import { type IUser } from "~/firebase/interfaces";
import { EventContext } from "..";
import LoadingSpinner from "../../LoadingSpinner";
import AddMemberModal from "./AddMemberModal";
import MemberCard from "./MemberCard";

const Members: FC = () => {
  const { ROLE, event } = useContext(EventContext);
  let q = null;
  if (event.members.length > 0) {
    q = query(userCollection, where("id", "in", event.members));
  }
  const [creator, loadingAsWell, errorAsWell] = useCollection(
    query(userCollection, where("id", "==", event.creatorId))
  );
  const [members, loading, error] = useCollection(q);

  if (loading || loadingAsWell) {
    return <LoadingSpinner />;
  }

  if (error || errorAsWell) {
    return <h1>An error occured please reload!</h1>;
  }

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
      <MemberCard member={creator?.docs[0]?.data() as IUser} isCreator />
      {members?.docs.map((doc, idx) => {
        return <MemberCard member={doc.data()} key={idx} isCreator={false} />;
      })}
    </>
  );
};

export default Members;
