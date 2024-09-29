"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { MdGifBox } from "react-icons/md";
import { BiPoll } from "react-icons/bi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

const TweetModal = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Yo submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(`data`, null, 2)}</code>
        </pre>
      ),
    });
  }

  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser || undefined);
    }
  }, [currentUser]);

    const handleSelectImage = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
    }, []);

  return (
    <>
      <div className="border  border-gray-800 p-4 cursor-pointer hover:bg-gray-950 transition-all min-h-fit">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1  mt-2">
            {user?.profileImageUrl && (
              <Image
                className="rounded-full"
                src={user?.profileImageUrl}
                alt="user-image"
                height={50}
                width={50}
              />
            )}
          </div>
          <div className="col-span-11 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
              >
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="text-xl">
                        <Textarea
                          placeholder="What is happening?"
                          className="resize-y rows={1} min-h-fit overflow-y border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="border border-gray-800"></div>
                <div className="flex justify-between items-center">
                  <div className="flex  items-center text-xl text-[#1d9bf0]">
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <MdPhotoSizeSelectActual onClick={handleSelectImage}/>
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <MdGifBox />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <BiPoll />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <MdOutlineEmojiEmotions />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <RiCalendarScheduleLine />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-2 transition-all">
                      <CiLocationOn />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-fit py-1 px-5 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 rounded-full text-center font-bold text-base dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TweetModal;
