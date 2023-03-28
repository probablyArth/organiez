import { ActionIcon, Button, Drawer } from "@mantine/core";
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { EventContext, type menu } from ".";
import { createMedia } from "@artsy/fresnel";
import { useDisclosure } from "@mantine/hooks";
import { ImCross } from "react-icons/im";

const Sidebar: FC<{
  currMenu: menu;
  setCurrMenu: Dispatch<SetStateAction<menu>>;
}> = ({ currMenu, setCurrMenu }) => {
  const { ROLE } = useContext(EventContext);

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

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <MediaContextProvider>
      <Media greaterThanOrEqual="md" className="h-full">
        <nav className="flex h-full w-[300px] flex-col items-center justify-center gap-10 shadow-md">
          <Button
            variant={currMenu === 0 ? "outline" : "filled"}
            onClick={() => {
              setCurrMenu(0);
            }}
            size="xl"
          >
            Tasks
          </Button>
          <Button
            variant={currMenu === 1 ? "outline" : "filled"}
            onClick={() => {
              setCurrMenu(1);
            }}
            size="xl"
          >
            Members
          </Button>
          {ROLE === "CREATOR" && (
            <Button
              variant={currMenu === 2 ? "outline" : "filled"}
              onClick={() => {
                setCurrMenu(2);
              }}
              size="xl"
            >
              Settings
            </Button>
          )}
        </nav>
      </Media>
      <Media between={["zero", "sm"]}>
        <Button className="absolute" onClick={open}>
          Menu
        </Button>
        <Drawer.Root opened={opened} onClose={close}>
          <Drawer.Overlay />
          <Drawer.Content>
            <nav className="relative flex h-screen w-screen flex-col items-center justify-center gap-10 shadow-md">
              <ActionIcon
                className="absolute top-6"
                color="blue"
                onClick={close}
              >
                <ImCross size={30} />
              </ActionIcon>
              <Button
                variant={currMenu === 0 ? "outline" : "filled"}
                onClick={() => {
                  setCurrMenu(0);
                }}
                size="xl"
              >
                Tasks
              </Button>
              <Button
                variant={currMenu === 1 ? "outline" : "filled"}
                onClick={() => {
                  setCurrMenu(1);
                }}
                size="xl"
              >
                Members
              </Button>
              {ROLE === "CREATOR" && (
                <Button
                  variant={currMenu === 2 ? "outline" : "filled"}
                  onClick={() => {
                    setCurrMenu(2);
                  }}
                  size="xl"
                >
                  Settings
                </Button>
              )}
            </nav>
          </Drawer.Content>
        </Drawer.Root>
      </Media>
    </MediaContextProvider>
  );
};

export default Sidebar;
