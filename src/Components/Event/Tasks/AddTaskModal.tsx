import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { type FC, forwardRef, useState, useEffect } from "react";
import { addDoc, or, query, where } from "firebase/firestore";
import { taskCollection, userCollection } from "~/firebase/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import LoadingSpinner from "../../LoadingSpinner";
import { type IEvent, STATUS } from "~/firebase/interfaces";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { v4 } from "uuid";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}
const SelectItem: FC<ItemProps> = forwardRef<HTMLDivElement, ItemProps>(
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
  const [otherError, setError] = useState<null | string>(null);
  const handleSubmit = (description: string, assignee: string) => {
    addDoc(taskCollection, {
      id: v4(),
      assigned: assignee,
      eventId: event.id,
      description,
      status: STATUS.NOT_STARTED,
    })
      .then(() => {
        modals.closeAll();
      })
      .catch((e: Error) => {
        setError(e.message);
      });
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
  const [members, loading, error] = useCollection(q);
  const [data, setData] = useState<null | { value: string; label: string }[]>(
    null
  );
  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!loading) {
      if (members?.docs) {
        setData(
          members?.docs.map((member) => {
            const data = member.data();
            return {
              label: data.name,
              value: data.id,
              image: data.avatar,
              description: data.gmail,
            };
          }) as { value: string; label: string }[]
        );
      }
    }
  }, [loading, members?.docs]);
  if (loading) return <LoadingSpinner />;

  if (event.members.length === 0) return <h1>First add members</h1>;

  return (
    <>
      <div className="text-red">
        {error && <h1>{error.message}</h1>}
        {otherError && <h1>{otherError}</h1>}
      </div>
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values.description, assignee as string);
        })}
      >
        <TextInput
          label="Task Description"
          required
          {...form.getInputProps("description")}
        />
        <div>
          {!loading && data !== null && (
            <Select
              className="z-[1000000]"
              dropdownPosition="bottom"
              data={data as { value: string; label: string }[]}
              searchable
              required
              itemComponent={SelectItem}
              label="Assignee"
              value={assignee}
              withinPortal
              onChange={(value) => setAssignee(value as string)}
            />
          )}
          <LoadingOverlay visible={loading} />
        </div>
        <Button type="submit">Add</Button>
      </form>
    </>
  );
};

export default AddTaskModal;
