import { ActionIcon, Button, Drawer } from "@mantine/core";
import { type Dispatch, type FC, type SetStateAction, useContext } from "react";
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

  const SideBarMenu = () => {
    return (
      <>
        <Button
          variant={currMenu === 0 ? "outline" : "filled"}
          onClick={() => {
            setCurrMenu(0);
            close();
          }}
          size="xl"
          className="w-[200px]"
        >
          Overview
        </Button>
        <Button
          variant={currMenu === 1 ? "outline" : "filled"}
          onClick={() => {
            setCurrMenu(1);
            close();
          }}
          size="xl"
          className="w-[200px]"
        >
          Tasks
        </Button>
        <Button
          variant={currMenu === 2 ? "outline" : "filled"}
          onClick={() => {
            setCurrMenu(2);
            close();
          }}
          size="xl"
          className="w-[200px]"
        >
          Members
        </Button>
        {ROLE === "CREATOR" && (
          <Button
            variant={currMenu === 3 ? "outline" : "filled"}
            onClick={() => {
              setCurrMenu(3);
              close();
            }}
            size="xl"
            className="w-[200px]"
          >
            Settings
          </Button>
        )}
      </>
    );
  };

  return (
    <MediaContextProvider>
      <Media greaterThanOrEqual="md" className="h-full">
        <nav className="flex h-full w-[300px] flex-col items-center justify-center gap-10 shadow-md">
          <SideBarMenu />
        </nav>
      </Media>
      <Media between={["zero", "md"]}>
        <Button
          className={`absolute z-[100000000000000000] rounded-l-none rounded-r-full ${
            opened ? "hidden" : ""
          }`}
          onClick={open}
        >
          Menu
        </Button>
        <Drawer.Root opened={opened} onClose={close}>
          <Drawer.Overlay fixed />
          <Drawer.Content className="w-screen">
            <nav className="relative flex h-screen w-full flex-col items-center justify-center gap-10 bg-white shadow-md">
              <ActionIcon
                className="absolute top-6"
                color="blue"
                onClick={close}
              >
                <ImCross size={30} />
              </ActionIcon>
              <SideBarMenu />
            </nav>
          </Drawer.Content>
        </Drawer.Root>
      </Media>
    </MediaContextProvider>
  );
};

export default Sidebar;
