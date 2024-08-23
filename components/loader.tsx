import Image from "next/image";

export const Loader = () => {
  return (
    <div className="flex space-x-1 justify-center items-center bg-white dark:invert">
      <span className="text-sm font-light">Lisa is thinking</span>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
    </div>
  );
};
