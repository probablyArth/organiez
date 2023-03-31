import { type FC, useContext, useState, lazy, Suspense } from "react";
import { type IEvent } from "~/firebase/interfaces";
import { createContext } from "react";
import { AuthContext } from "~/pages/_app";
import { ScrollArea } from "@mantine/core";
import Sidebar from "./Sidebar";
import LoadingSpinner from "../LoadingSpinner";

const Overview = lazy(() => import("./Overview"));
const Members = lazy(() => import("./Members"));
const Tasks = lazy(() => import("./Tasks"));
const Settings = lazy(() => import("./Settings"));

export type menu = 0 | 1 | 2 | 3;
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
        <Sidebar currMenu={currMenu} setCurrMenu={setCurrMenu}/>
        <ScrollArea className="flex h-full w-full">
          <div className="flex h-full w-full flex-col items-center gap-4 p-4">
            <Suspense
              fallback={
                <div className="relative h-[calc(100vh-160px)] w-full">
                  <LoadingSpinner />
                </div>
              }
            >
              {currMenu === 0 && <Overview />}
              {currMenu === 1 && <Tasks />}
              {currMenu === 2 && <Members />}
              {currMenu === 3 && ROLE === "CREATOR" && <Settings />}
            </Suspense>
          </div>
        </ScrollArea>
      </div>
    </EventContext.Provider>
  );
};

export default Event;
