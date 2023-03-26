import { Button, Select } from "@mantine/core";
import { DocumentData } from "firebase/firestore";
import { FC } from "react";

const Header: FC<{ events: DocumentData[] }> = ({ events }) => {
  return (
    <header className="flex w-full justify-between bg-red-400">
      {events.length === 0 ? (
        <Button>Create a new event</Button>
      ) : (
        <Select
          data={events.map((value) => {
            return { value: value.title, label: value.title };
          })}
          transitionProps={{
            transition: "pop-top-left",
            duration: 80,
            timingFunction: "ease",
          }}
          searchable
          value={events[0]?.title}
        />
      )}
    </header>
  );
};

export default Header;
