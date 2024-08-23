"use client";

import { BotAvatar } from "@/components/lisa-avatar";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMessageStore from "@/hooks/message";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export default function Home() {
  const [chat, setChat] = useState("text");
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState("");
  const messages = useMessageStore();

  useEffect(() => {
    videoConversation();
  }, []);

  const videoConversation = async () => {
    const videoLink = await axios.post("/api/create_video_conversation");
    setVideoUrl(videoLink.data.data.conversation_url);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      messages.addMessage({ role: "user", message_content: values.prompt });
      messages.addMessage({ role: "bot", message_content: "I am fine" });
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-6 px-2 h-full w-full">
          <h1 className="text-purple-700 font-bold text-lg mb-6">Your Coach Lisa!</h1>
          <iframe
            width="560"
            height="315"
            src={videoUrl}
            title="GeeksforGeeks"
            allow="camera;microphone"
            className="rounded-lg shadow-purple-300 shadow-xl"
          ></iframe>
        </div>
      </div>
      <div className="flex flex-col h-screen px-2 absolute right-2 bg-purple-100 border-l-2 rounded-tl-2xl rounded-bl-2xl">
        <div className="flex items-center px-14 justify-between my-4 gap-x-4">
          <Button className="bg-purple-700 drop-shadow-lg shadow-purple-300 rounded-xl" onClick={() => setChat("text")}>
            Text Chat
          </Button>
          <Button className="bg-purple-700 drop-shadow-lg shadow-purple-300 rounded-xl" onClick={() => setChat("video")}>
            Video Chat
          </Button>
        </div>

        <>
          <div className="flex-grow px-2 lg:px-4 w-full mx-2 overflow-y-auto">
            <div className="space-y-4 mt-4">
              {isLoading && (
                <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                  <Loader />
                </div>
              )}

              <div className="flex flex-col gap-y-4">
                {messages.messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-6 w-full flex gap-x-8 rounded-xl items-start",
                      "bg-white border-2 border-black/10 drop-shadow-lg shadow-purple-300 "
                    )}
                  >
                    {message.role === "bot" && <BotAvatar />}
                    {message.role !== "bot" && <MessageCircle />}
                    <p className="text-sm">{message.message_content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="chat" className="relative w-full mb-4 px-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="
              rounded-lg 
              border 
              w-full 
              p-1 
              px-1 
              md:px-4 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
              bg-white
            "
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-9 lg:col-span-9">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="What is realestate?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-3 lg:col-span-3 w-full bg-purple-700 text-sm"
                  type="submit"
                  disabled={isLoading}
                  size="icon"
                >
                  Send
                </Button>
              </form>
            </Form>
          </div>
        </>

        <div className="flex w-full items-center justify-center my-0 text-xs">
          Powered by{" "}
          <Image src={"/maindark.png"} width={80} height={30} alt="main logo" />
        </div>
      </div>
    </div>
  );
}
