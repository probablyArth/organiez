import { Avatar, Paper, Text } from "@mantine/core";
import { type FC } from "react";
import { FaCrown } from "react-icons/fa";
import { type IUser } from "~/firebase/interfaces";

const MemberCard: FC<{ member: IUser; isCreator: boolean }> = ({
  member,
  isCreator,
}) => {
  return (
    <Paper
      shadow="sm"
      p={"lg"}
      className="flex h-[80px] w-full items-center gap-4"
    >
      <Avatar src={member.avatar} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Text fw={700}>{member.name}</Text>
          {isCreator && <FaCrown color="gold" className="mb-[5px]" />}
        </div>
        <Text color="blue">{member.gmail}</Text>
      </div>
    </Paper>
  );
};

export default MemberCard;
