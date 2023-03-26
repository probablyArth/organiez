import { type FC, useContext, useState } from "react";
import { type IEvent } from "~/firebase/interfaces";
import Sidebar from "./Sidebar";
import Tasks from "./Tasks";
import Members from "./Members";
import Settings from "./Settings";
import { createContext } from "react";
import { AuthContext } from "~/pages/_app";

export type menu = 0 | 1 | 2;
type ROLE = "CREATOR" | "MEMBER";

interface IEventContext {
  event: IEvent;
  ROLE: ROLE;
}

export const EventContext = createContext<IEventContext>({
  event: { creatorId: "", description: "", id: "", members: [], title: "" },
  ROLE: "CREATOR",
});

const Event: FC<{ event: IEvent }> = ({ event }) => {
  const [currMenu, setCurrMenu] = useState<menu>(0);
  let ROLE: ROLE = "MEMBER";
  const { user } = useContext(AuthContext);
  if (event.creatorId === user?.id) {
    ROLE = "CREATOR";
  }
  return (
    <EventContext.Provider value={{ event, ROLE }}>
      <div className="flex h-full w-full items-center">
        <Sidebar currMenu={currMenu} setCurrMenu={setCurrMenu} />
        <div className="flex h-full w-full flex-col items-center gap-4 p-4">
          {currMenu === 0 && <Tasks />}
          {currMenu === 1 && <Members />}
          {currMenu === 2 && ROLE === "CREATOR" && <Settings />}
        </div>
      </div>
    </EventContext.Provider>
  );
};

export default Event;
