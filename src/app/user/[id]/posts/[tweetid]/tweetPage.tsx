import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FaHeart, FaRegComment, FaUser } from "react-icons/fa6";
import { UnFollowUser, FollowUser } from "@/actions/follow_unfollow";
import { like, dislike } from "@/actions/liket_dislike";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiMenuKebab, CiHeart, CiBookmark } from "react-icons/ci";
import { GoUpload } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { deletePost } from "@/actions/deletePost";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Comment, Tweet, User } from "@/gql/graphql";
import CommentPage from "./Comment";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/hooks/tweets";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content must be at least 1 characters.",
    })
    .max(50, {
      message: "Bio must not be longer than 50 characters.",
    }),
});

const TweetPage = ({
  tweet,
  user,
  liked,
  setLiked,
}: {
  user: User;
  tweet: Tweet;
  setLiked: (liked: boolean) => void;
  liked: boolean;
}) => {
  const router = useRouter();

  const { mutate } = useCreateComment();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const contentValue = form.watch("content");
  useEffect(() => {
    if (user !== undefined) {
      form.reset({
        content: "",
      });
    }
  }, [user]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.reset({
      content: "",
    });
    mutate({ content: data.content, tweetId: tweet.id });
    form.reset();
  }

  const handleLike = useCallback(
    async () => await like(user as User, tweet as Tweet, setLiked, liked),
    [user, tweet]
  );

  const handledislike = useCallback(
    async () => await dislike(user as User, tweet as Tweet, setLiked, liked),
    [user, tweet]
  );

  const handleDeletePost = useCallback(async () => {
    await deletePost(tweet as Tweet);
    router.push("/");
  }, [tweet]);

  const handleUnfollowUser = useCallback(
    async () => await UnFollowUser((tweet as Tweet).user, () => {}),
    [(tweet as Tweet)?.user]
  );

  const handleFollowUser = useCallback(
    async () => await FollowUser((tweet as Tweet).user, () => {}),
    [(tweet as Tweet)?.user]
  );

  return (
    <>
      <div className="border border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606]  ">
        <div className="flex gap-2 items-center mb-2">
          <Link href={`/user/${tweet.user.id}`} className="flex items-center">
            {tweet.user?.profileImageUrl && (
              <Image
                className="rounded-full"
                src={tweet.user.profileImageUrl}
                alt="user-image"
                height={35}
                width={35}
              />
            )}
          </Link>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col  justify-start font-sans">
              <Link href={`/user/${tweet.user.id}`}>
                <h5 className="text-white font-bold text-sm hover:underline">
                  {tweet.user.firstName} {tweet.user.lastName}
                </h5>
              </Link>
              <p className="text-gray-400 text-sm">
                @{tweet.user.firstName}
                {tweet.user.lastName}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-1 py-2 rounded-full hover:bg-gray-900 hover:text-[#1d9bf0]">
                  <CiMenuKebab />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-40  bg-black "
                style={{
                  boxShadow:
                    "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px",
                }}
              >
                <DropdownMenuGroup>
                  <Link href={`/user/${tweet.user.id}`}>
                    <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                      <FaUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  {user?.id === tweet.user.id ? (
                    <DropdownMenuItem
                      className="flex justify-between items-center px-4 hover:bg-gray-900"
                      onClick={handleDeletePost}
                    >
                      <MdDelete className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {user?.following?.findIndex(
                        (el) => el?.id === tweet.user.id
                      ) !== -1 ? (
                        <DropdownMenuItem
                          className="flex justify-between items-center px-4 hover:bg-gray-900"
                          onClick={handleUnfollowUser}
                        >
                          <RiUserUnfollowFill className="mr-2 h-4 w-4" />
                          <span>Unfollow</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="flex justify-between items-center px-4 hover:bg-gray-900"
                          onClick={handleFollowUser}
                        >
                          <RiUserFollowFill className="mr-2 h-4 w-4" />
                          <span>Follow</span>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <p className="text-lg font-semibold">{tweet.content}</p>
          {tweet.imageUrl && (
            <div>
              <Image
                src={tweet.imageUrl}
                alt="tweet-image"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="border border-gray-800 mb-2"></div>
        <div className="flex justify-between mb-2 text-xl">
          <div className="rounded-full  p-2 gap-2 flex justify-center items-center transition-colors ">
            <FaRegComment
              size={20}
              className="text-[#959494] hover:text-[#1d9bf0] "
            />
            <p className="text-center text-sm text-[#959494]">
              {tweet.comments?.length | 0}
            </p>
          </div>
          <div className=" rounded-full  p-2 flex justify-center items-center">
            <AiOutlineRetweet
              size={20}
              className="text-[#959494] hover:text-[#00ba7c]"
            />
          </div>
          <div className="rounded-full  p-2 gap-2 flex justify-center items-center  hover:text-[#f91880]">
            {liked ? (
              <>
                <div className="text-[#f91880]  flex gap-2  justify-center items-center ">
                  <FaHeart onClick={handledislike} size={20} />
                  <p className=" text-center text-sm ">
                    {tweet.likes?.length | 0}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2 justify-center items-center transition-all ">
                  <CiHeart
                    onClick={handleLike}
                    size={20}
                    className="text-[#959494] hover:text-[#f91880] "
                  />
                  <p className="text-[#959494]  text-center text-sm ">
                    {tweet.likes?.length | 0}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="rounded-full  p-2 flex justify-center items-center">
            <VscGraph
              size={20}
              className="text-[#959494] hover:text-[#1d9bf0]"
            />
          </div>
          <div>
            <div className="flex gap-2">
              <div className="rounded-full  p-2 flex justify-center items-center">
                <CiBookmark
                  size={20}
                  className="text-[#959494] hover:text-[#1d9bf0] "
                />
              </div>
              <div className="rounded-full  p-2 flex justify-center items-center">
                <GoUpload
                  size={20}
                  className="text-[#959494] hover:text-[#1d9bf0]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-gray-800 mb-3"></div>
        <div className="flex justify-between gap-2 items-center">
          <div className="w-14">
            {user?.profileImageUrl && (
              <Image
                src={user.profileImageUrl}
                alt="profile-image"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2 flex items-center"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="text-xl leading-3">
                        <Input
                          placeholder="Add a comment"
                          {...field}
                          className="w-full overflow-y bg-inherit text-base border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                        />
                        {/* <Textarea
                          placeholder="Add a comment"
                          className="w-full h-2 bg-inherit text-base border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-none  foucs-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                          {...field}
                        /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    contentValue?.length < 1 || contentValue?.length > 50
                  }
                  className="w-fit py-1 px-5 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 rounded-full text-center font-bold text-base dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Reply
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      {tweet.comments
        ?.filter((comment): comment is Comment => comment !== null)
        .map((comment: Comment) => (
          <CommentPage
            key={comment.id}
            comment={comment}
            user={user}
            tweet={tweet}
          />
        ))}
    </>
  );
};

export default TweetPage;
