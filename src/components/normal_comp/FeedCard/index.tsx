"use client";
import React from "react";
import Image from "next/image";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { VscGraph } from "react-icons/vsc";
import { GoUpload } from "react-icons/go";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
  tweet: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ tweet }) => {
  return (
    <>
      <div className="border  border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606] transition-all">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`/${tweet.user.id}`}>
          <div className="col-span-1  ">
            {tweet.user?.profileImageUrl && (
              <Image
                className="rounded-full"
                src={tweet.user.profileImageUrl}
                alt="user-image"
                height={50}
                width={50}
              />
            )}
          </div>
          </Link>
          <div className="col-span-11">
          <Link href={`/${tweet.user.id}`}>
            <h5 className="font-bold hover:underline w-fit">{tweet.user.firstName} {tweet.user.lastName}</h5>
          </Link>
            <p>{tweet.content}</p>
            <div className="flex justify-between mt-4 text-xl">
              <div>
                <FaRegComment size={20} style={{ color: "#71767b" }} />
              </div>
              <div>
                <AiOutlineRetweet size={20} style={{ color: "#71767b" }} />
              </div>
              <div>
                <CiHeart size={20} style={{ color: "#71767b" }} />
              </div>
              <div>
                <VscGraph size={20} style={{ color: "#71767b" }} />
              </div>
              <div>
                <div className="flex gap-2">
                  <CiBookmark size={20} style={{ color: "#71767b" }} />
                  <GoUpload size={20} style={{ color: "#71767b" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedCard;
