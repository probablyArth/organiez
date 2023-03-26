import { Button } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";
import { menu } from ".";

const Sidebar: FC<{
  currMenu: menu;
  setCurrMenu: Dispatch<SetStateAction<menu>>;
}> = ({ currMenu, setCurrMenu }) => {
  return (
    <nav className="flex h-full w-full max-w-[300px] flex-col items-center justify-center gap-10 shadow-md">
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
      <Button
        variant={currMenu === 2 ? "outline" : "filled"}
        onClick={() => {
          setCurrMenu(2);
        }}
        size="xl"
      >
        Settings
      </Button>
    </nav>
  );
};

export default Sidebar;
