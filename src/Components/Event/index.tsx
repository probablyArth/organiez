import { FC } from "react";
import { IEvent } from "~/firebase/interfaces";
import Sidebar from "./Sidebar";

const Event: FC<{ event: IEvent }> = ({ event }) => {
  return (
    <div className="flex h-full w-full items-center">
      <Sidebar />
      <div className="w-full">hi</div>
    </div>
  );
};

export default Event;
