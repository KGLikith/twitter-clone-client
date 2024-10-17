"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTweet } from "@/hooks/tweets";
import { User } from "@/gql/graphql";
import { apolloClient } from "@/clients/api";
import { getSignedUrlforTweetQuery } from "@/graphql/query/tweet";
import { toast } from "@/hooks/use-toast";
// import { toast } from "@/hooks/use-toast";
// import { apolloClient } from "@/clients/api";
// import queryclient from "@/clients/queryClient";

const FormSchema = z.object({
  content: z
    .string()
    .min(3, {
      message: "Content must be at least 3 characters.",
    })
    .max(100, {
      message: "Bio must not be longer than 100 characters.",
    }),
});

const TweetModal = () => {
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();
  const { mutate } = useCreateTweet();
  const [imageUrl, setImageUrl] = useState<string | null>();
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      setImageUrl(null);
      form.reset({
        content: "",
      });
    } else {
      setUser(undefined);
    }
  }, [currentUser]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const contentValue = form.watch("content");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.reset({
      content: "",
    });
    mutate({ content: data.content, imageUrl });
    setImageUrl(null);
    form.reset();
  }

  const handleImageChange = useCallback((input: HTMLInputElement) => {
    return async (e: Event) => {
      e.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;
      try {
        const { data, error } = await apolloClient.query({
          query: getSignedUrlforTweetQuery,
          variables: {
            imageType: file.type,
            imageName: file.name,
          },
        });
        const { getSignedURLForTweet } = data;
        if (getSignedURLForTweet) {
          try {
            await axios.put(getSignedURLForTweet, file, {
              headers: {
                "Content-Type": file.type,
              },
            });
            
          } catch (error) {
            console.log(error);
          }
          const url = new URL(getSignedURLForTweet);
          const imageUrl = url.origin + url.pathname;
          setImageUrl(imageUrl);
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Not authorised",
        });
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    const handlerFn = handleImageChange(input);
    input.addEventListener("change", handlerFn);

    input.click();
  }, []);

  return (
    <>
      <div className="border  border-gray-800 p-2 md:p-4 cursor-pointer hover:bg-[#0a0606] transition-all min-h-fit">
        <div className="grid grid-cols-12 md:gap-2">
          <div className="col-span-1 md:col-span-1 min-w-4 mt-5 md:mt-2">
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
          <div className="col-span-11 md:col-span-11 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="text-xl">
                        <Textarea
                          placeholder="What is happening?"
                          className="resize-y rows={1} bg-inherit min-h-fit overflow-y border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {imageUrl && (
                  <div className="w-full">
                    <Image
                      src={imageUrl}
                      alt="tweet-image"
                      width={300}
                      height={300}
                    />
                  </div>
                )}
                <div className="border border-gray-800"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xl text-[#1d9bf0]">
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <MdPhotoSizeSelectActual onClick={handleSelectImage} />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <MdGifBox />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <BiPoll />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <MdOutlineEmojiEmotions />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <RiCalendarScheduleLine />
                    </div>
                    <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-1 md:p-2 transition-all">
                      <CiLocationOn />
                    </div>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={
                        contentValue?.length < 3 || contentValue?.length > 100
                      }
                      className="w-fit py-1 px-5 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 rounded-full text-center font-bold text-base dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Post
                    </Button>
                  </div>
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
