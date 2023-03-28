import { Paper, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "..";
import { useCollection } from "react-firebase-hooks/firestore";
import { Query, QueryFilterConstraint, query, where } from "firebase/firestore";
import { taskCollection, userCollection } from "~/firebase/collections";
import LoadingSpinner from "~/Components/LoadingSpinner";
import { IUser, STATUS } from "~/firebase/interfaces";

const TaskStats = () => {
  const { event } = useContext(EventContext);
  const [tasks, loading, error] = useCollection(
    query(taskCollection, where("eventId", "==", event.id))
  );

  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (tasks && tasks.docs.length > 0) {
      let completed = 0;
      tasks.forEach((task) => {
        if (task.data().status === STATUS.FINISHED) {
          completed += 1;
        }
      });
      setCompleted(completed);
    }
  }, [loading]);

  if (error) return <h1>An error occurred while fetching tasks</h1>;

  return (
    <div className="flex justify-between">
      <Text fz={"lg"}>Tasks</Text>
      {tasks && tasks.docs.length > 0 ? (
        <>
          <Text
            color={completed === tasks.docs.length ? "green" : "red"}
            fz={"lg"}
            fw={"bold"}
          >
            {completed}/{tasks.docs.length}
          </Text>
        </>
      ) : (
        "Add tasks"
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
};

const MemberStats = () => {
  const { event } = useContext(EventContext);
  let q: Query<IUser> | undefined = undefined;
  if (event.members.length > 0) {
    q = query(userCollection, where("id", "in", event.members));
  }
  const [users, loading, error] = useCollection(q);
  if (error) return <h1>An error occurred while fetching tasks</h1>;

  return (
    <div className="flex justify-between">
      <Text fz={"lg"}>Members</Text>
      <Text fz={"lg"} fw={"bold"}>
        {users ? <>{users.docs.length + 1}</> : 1}
      </Text>
      {loading && <LoadingSpinner />}
    </div>
  );
};

const StatsCard = () => {
  return (
    <Paper
      p={"lg"}
      shadow="sm"
      w={"100%"}
      className="relative flex h-full flex-col"
    >
      <TaskStats />
      <MemberStats />
    </Paper>
  );
};

export default StatsCard;
