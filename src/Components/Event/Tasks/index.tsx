import { Button, Text } from "@mantine/core";
import { useContext } from "react";
import { EventContext } from "..";
import { query, where } from "firebase/firestore";
import { taskCollection } from "~/firebase/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import LoadingSpinner from "../../LoadingSpinner";
import { modals } from "@mantine/modals";
import AddTaskModal from "./AddTaskModal";
import TaskCard from "./TaskCard";

const Tasks = () => {
  const { event, ROLE } = useContext(EventContext);

  const [tasks, loading, error] = useCollection(
    query(taskCollection, where("eventId", "==", event.id))
  );

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {error && <Text fz={"sm"}>{error.message}</Text>}
      {ROLE === "CREATOR" && (
        <Button
          onClick={() => {
            modals.open({
              title: "Add a task",
              children: <AddTaskModal event={event} />,
              size: "lg",
            });
          }}
        >
          Add task
        </Button>
      )}
      {tasks && tasks?.docs.length > 0 ? (
        tasks?.docs.map((data, idx) => (
          <TaskCard task={data.data()} key={idx} />
        ))
      ) : (
        <h1>No tasks!</h1>
      )}
    </>
  );
};

export default Tasks;
