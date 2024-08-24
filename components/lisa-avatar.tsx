import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const BotAvatar = () => {
  return (
    <Avatar className="h-10 w-10">
      <AvatarImage className="p-0" src="/lisa.png" />
    </Avatar>
  );
};