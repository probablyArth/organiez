import { Avatar, Button, Menu, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { addDoc } from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useContext } from "react";
import { eventCollection } from "~/firebase/collections";
import { IEvent } from "~/firebase/interfaces";
import { AuthContext } from "~/pages/_app";
import { BsFillTrashFill } from "react-icons/bs";
import { auth } from "~/firebase";

const Modal = () => {
  const { user } = useContext(AuthContext);

  const handleSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    await addDoc(eventCollection, {
      creatorId: user?.id,
      title: values.title,
      description: values.description,
    });
    modals.closeAll();
  };

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? "Too short" : null),
      description: (value) => (value.trim().length < 3 ? "Too short" : null),
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <TextInput
        label="Title"
        required
        placeholder="banger party"
        {...form.getInputProps("title")}
      />
      <TextInput
        label="Description"
        required
        placeholder="this party is going to be so banger omg"
        {...form.getInputProps("description")}
      />
      <Button type="submit">Create</Button>
    </form>
  );
};

const Header: FC<{
  events: IEvent[];
  setCurrEvent: Dispatch<SetStateAction<string | null>>;
  currEvent: string | null;
}> = ({ events, setCurrEvent, currEvent }) => {
  const { user } = useContext(AuthContext);
  return (
    <header className="-4 flex h-[100px] w-full items-center justify-between px-6 shadow-md">
      <div className="flex gap-4">
        {events.length !== 0 && (
          <Select
            data={events.map((value, idx) => {
              return { value: Number(idx).toString(), label: value.title };
            })}
            transitionProps={{
              transition: "pop-top-left",
              duration: 80,
              timingFunction: "ease",
            }}
            searchable
            value={currEvent}
            onChange={(value) => setCurrEvent(value)}
          />
        )}
        <Button
          onClick={() => {
            modals.open({
              title: "Create new event",
              children: <Modal />,
            });
          }}
        >
          Create a new event
        </Button>
      </div>
      <Menu shadow="md">
        <Menu.Target>
          <Avatar src={user?.avatar} className="cursor-pointer" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            icon={<BsFillTrashFill />}
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </header>
  );
};

export default Header;
