import { Text, Title } from "@mantine/core";
import { useContext } from "react";
import { EventContext } from "../index";

const Overview = () => {
  const { event } = useContext(EventContext);

  return (
    <>
      <Title>
        <mark className="inline-block bg-blue-300 pb-[20px] leading-[0]">
          {event.title}
        </mark>
      </Title>
      <Text fz={"sm"}>{event.description}</Text>
    </>
  );
};

export default Overview;
