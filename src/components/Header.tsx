import { Avatar, Burger, Button, Menu, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { addDoc } from "firebase/firestore";
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { eventCollection } from "~/firebase/collections";
import { type IEvent } from "~/firebase/interfaces";
import { AuthContext } from "~/pages/_app";
import { BsFillTrashFill } from "react-icons/bs";
import { auth } from "~/firebase";
import { v4 } from "uuid";
import { createMedia } from "@artsy/fresnel";
import { useClickOutside } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

const Modal = () => {
  const { user } = useContext(AuthContext);

  const handleSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    await addDoc(eventCollection, {
      creatorId: user?.id as string,
      title: values.title,
      description: values.description,
      members: [],
      id: v4(),
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
      onSubmit={form.onSubmit((e) => {
        handleSubmit(e).catch((e: Error) => {
          notifications.show({
            message: "An error occurred while creating an event!",
            color: "red",
          });
          console.log({ e });
        });
      })}
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
  const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
      zero: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      twoXl: 1536,
    },
  });
  const [opened, setOpened] = useState(false);
  const { user } = useContext(AuthContext);

  const ref = useClickOutside(() => setOpened((prev) => !prev));
  return (
    <header className="flex h-[120px] w-screen items-center justify-between px-6 shadow-md sticky top-0">
      <div className="flex gap-4">
        <MediaContextProvider>
          <Media greaterThanOrEqual="sm">
            <div className="flex gap-4">
              {events.length !== 0 && (
                <Select
                  data={events.map((value, idx) => {
                    return {
                      value: Number(idx).toString(),
                      label: value.title,
                    };
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
          </Media>
          <Media between={["zero", "sm"]}>
            <Menu opened={opened} width={200}>
              <Menu.Target>
                <Burger
                  opened={opened}
                  onClick={() => {
                    setOpened((prev) => !prev);
                  }}
                  color="black"
                  transitionDuration={200}
                  className={opened ? "hidden" : ""}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <div ref={ref}>
                  <Menu.Item>
                    {events.length !== 0 && (
                      <Select
                        data={events.map((value, idx) => {
                          return {
                            value: Number(idx).toString(),
                            label: value.title,
                          };
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
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      onClick={() => {
                        modals.open({
                          title: "Create new event",
                          children: <Modal />,
                        });
                        setOpened(false);
                      }}
                    >
                      Create a new event
                    </Button>
                  </Menu.Item>
                </div>
              </Menu.Dropdown>
            </Menu>
          </Media>
        </MediaContextProvider>
      </div>
      <Menu shadow="md" position="left">
        <Menu.Target>
          <Avatar src={user?.avatar} className="cursor-pointer" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            icon={<BsFillTrashFill />}
            onClick={() => {
              auth.signOut().catch((e: Error) => {
                notifications.show({
                  message: "There was an error while signing out!",
                  color: "red",
                });
                console.log({ e });
              });
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
