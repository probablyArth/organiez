import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { FC, forwardRef, useContext, useState } from "react";
import { EventContext } from ".";
import {
  addDoc,
  doc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { taskCollection, userCollection } from "~/firebase/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import LoadingSpinner from "../LoadingSpinner";
import { IEvent, ITask, IUser, STATUS } from "~/firebase/interfaces";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { v4 } from "uuid";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "~/pages/_app";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap p={2}>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const AddTaskModal: FC<{ event: IEvent }> = ({ event }) => {
  const handleSubmit = async (description: string, assignee: string) => {
    console.log({ description, assignee });
    await addDoc(taskCollection, {
      id: v4(),
      assigned: assignee,
      eventId: event.id,
      description,
      status: STATUS.NOT_STARTED,
    });
    modals.closeAll();
  };

  const form = useForm({
    initialValues: {
      description: "",
    },
    validate: {
      description: (value) => (value.trim().length < 2 ? "Too short" : null),
    },
  });
  let q = null;
  if (event.members.length > 0) {
    q = query(
      userCollection,
      or(where("id", "in", event.members), where("id", "==", event.creatorId))
    );
  }
  const [members, loading] = useCollection(q);
  const data = members?.docs.map((member) => {
    const data = member.data();
    return {
      label: data.name,
      value: data.id,
      image: data.avatar,
      description: data.gmail,
    };
  }) as { value: string; label: string }[];

  const [assignee, setAssignee] = useState<string | undefined>(
    data && data[0] ? data[0].value : undefined
  );
  if (event.members.length < 0) return <h1>First add members</h1>;

  return (
    <form
      className="flex h-full flex-col gap-4"
      onSubmit={form.onSubmit((values) =>
        handleSubmit(values.description, assignee as string)
      )}
    >
      <TextInput
        label="Task Description"
        required
        {...form.getInputProps("description")}
      />
      <div>
        {!loading && (
          <Select
            className="z-[1000000]"
            dropdownPosition="bottom"
            data={data}
            searchable
            required
            itemComponent={SelectItem}
            label="Assignee"
            value={assignee}
            withinPortal
            onChange={(value) =>
              setAssignee((prev) => {
                console.log({ prev });
                return value as string;
              })
            }
          />
        )}
        <LoadingOverlay visible={loading} />
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
};

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
  const [user, loading] = useCollection(assignedQuery);
  const userData = user?.docs[0]?.data() as IUser;
  return (
    <Paper
      className="flex h-[100px] w-full items-center justify-between"
      shadow="sm"
      p={"lg"}
    >
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

const Tasks = () => {
  const { event, ROLE } = useContext(EventContext);

  const [tasks, loading] = useCollection(
    query(taskCollection, where("eventId", "==", event.id))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
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
      {tasks?.docs.map((data, idx) => (
        <TaskCard task={data.data()} key={idx} />
      ))}
    </>
  );
};

export default Tasks;
