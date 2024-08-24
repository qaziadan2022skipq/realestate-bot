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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export default function Home() {
  const [chat, setChat] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [threadId, setThreadId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const messages = useMessageStore();

  useEffect(() => {
    videoConversation();
    if (!localStorage.getItem("thread_id")) {
      createThread();
    } else {
      const id = localStorage.getItem("thread_id") || "";
      setThreadId(id);
    }

    console.log(localStorage.getItem("thread_id"));
  }, []);

  const createThread = async () => {
    const thread_id = await axios.post("/api/create_thread");
    localStorage.setItem("thread_id", thread_id.data);
  };

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
      const response = await axios.post("/api/chat", {
        userMessage: values.prompt,
        threadId: localStorage.getItem("thread_id"),
      });

      messages.addMessage({
        role: "bot",
        message_content: response.data.text.value,
      });
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-600">
      {/* Iframe Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center mr-[24rem]">
          <h1 className="text-white font-bold text-lg mb-4">
            AI Lisa ✨ Mentor
          </h1>
          {chat === true ? (
            <iframe
              width="560"
              height="315"
              src={videoUrl}
              title="Video Conversation"
              allow="camera;microphone"
              className="rounded-lg shadow-purple-300 shadow-xl"
            ></iframe>
          ) : (
            <Image
              className="rounded-xl shadow-gray-300/20 shadow-md drop-shadow-lg"
              src={"/lisa.png"}
              width={300}
              height={300}
              alt="Lisa"
            />
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-200 border-l-2 border-purple-200 rounded-tl-2xl rounded-bl-2xl flex flex-col p-4">
        <div className="flex items-center justify-center gap-x-2 mb-4">
          {/* <Button
            className="bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-800"
            onClick={() => setChat("")}
          >
            Text Chat
          </Button>
          <Button
            className="bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-800"
            onClick={() => setChat("video")}
          >
            Video Chat
          </Button> */}
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              className=" border border-gray-400"
              onCheckedChange={(e) => setChat(e)}
            />
            <Label htmlFor="airplane-mode">Video Chat</Label>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 flex items-start gap-4 rounded-lg",
                  "bg-white border border-gray-200 shadow-md"
                )}
              >
                {message.role === "bot" && <BotAvatar />}
                {message.role !== "bot" && (
                  <MessageCircle className="h-6 w-6" />
                )}
                <p className="text-sm text-gray-700">
                  {message.message_content}
                </p>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="p-8 rounded-lg flex items-center justify-center bg-gray-100">
              <Loader />
            </div>
          )}
        </div>

        <div id="chat" className="mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                flex
                items-center
                rounded-lg
                border
                bg-white
                p-2
                shadow-md
                w-full
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        className="border-0 outline-none focus-visible:ring-0"
                        disabled={isLoading}
                        placeholder="What is real estate?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="bg-gray-700 text-white ml-2 hover:bg-gray-800"
                type="submit"
                disabled={isLoading}
              >
                Send
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex items-center justify-center mt-4 text-xs text-gray-700">
          Powered by{"  "}
          <Image
            src={"/maindark.png"}
            width={120}
            height={40}
            alt="Main Logo"
          />
        </div>
      </div>
    </div>
  );
}
