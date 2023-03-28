import { ActionIcon, Avatar, Badge, Paper, Text, Tooltip } from "@mantine/core";
import { type FC, useContext } from "react";
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { taskCollection, userCollection } from "~/firebase/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import { type ITask, type IUser, STATUS } from "~/firebase/interfaces";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "~/pages/_app";
import LoadingSpinner from "~/Components/LoadingSpinner";

const updateTaskStatus = async (taskId: string, status: STATUS) => {
  const taskDoc = doc(
    taskCollection,
    (await getDocs(query(taskCollection, where("id", "==", taskId)))).docs[0]
      ?.id
  );
  await updateDoc(taskDoc, { status: status });
};

const TaskCard: FC<{ task: ITask }> = ({ task }) => {
  let color = "orange";
  if (task.status === STATUS.STARTED) color = "yellow";
  if (task.status === STATUS.FINISHED) color = "green";
  const userContext = useContext(AuthContext);
  const assignedQuery = query(userCollection, where("id", "==", task.assigned));
  const [user, loading, error] = useCollection(assignedQuery);
  const userData = user?.docs[0]?.data() as IUser;
  return (
    <Paper
      className="relative flex h-full min-h-[120px] w-full items-center justify-between"
      shadow="sm"
      p={"lg"}
    >
      {error && <Text fz={"sm"}>{error.message}</Text>}
      {loading && <LoadingSpinner />}
      <div className="flex flex-col gap-2">
        <Text fz={"lg"}>{task.description}</Text>
        <div className="flex items-center">
          {!loading && (
            <Tooltip label={userData.name}>
              <Avatar src={userData.avatar} radius={"xl"} />
            </Tooltip>
          )}
        </div>
      </div>
      <div>
        <Badge color={color}>status: {STATUS[task.status]}</Badge>
        {!loading && userData.id === userContext.user?.id && (
          <div className="flex">
            {task.status !== STATUS.FINISHED && (
              <Tooltip label="Mark finished">
                <ActionIcon
                  color="green"
                  onClick={() => {
                    updateTaskStatus(task.id, STATUS.FINISHED);
                  }}
                >
                  <AiFillCheckCircle />
                </ActionIcon>
              </Tooltip>
            )}
            {task.status !== STATUS.FINISHED &&
              task.status !== STATUS.STARTED && (
                <Tooltip label="Mark started">
                  <ActionIcon
                    color="yellow"
                    onClick={() => {
                      updateTaskStatus(task.id, STATUS.STARTED);
                    }}
                  >
                    <FaCog />
                  </ActionIcon>
                </Tooltip>
              )}
          </div>
        )}
      </div>
    </Paper>
  );
};

export default TaskCard;
