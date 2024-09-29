"use server"
import React from "react";
import Image from "next/image";
import { FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { VscGraph } from "react-icons/vsc";
import { GoUpload } from "react-icons/go";

const FeedCard: React.FC = () => {
  return (
    <>
      <div className="border  border-gray-800 p-4 cursor-pointer hover:bg-gray-950 transition-all">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1  ">
            <Image
              className="rounded-full"
              src="https://avatars.githubusercontent.com/u/150937474?v=4"
              alt="user-image"
              height={50}
              width={50}
            />
          </div>
          <div className="col-span-11">
            <h5 className="font-bold">Likith</h5>

            <p>
              As President I will immediately end the migrant invasion of
              America. We will stop all migrant flights, end all illegal
              entries, terminate the Kamala phone app for smuggling illegals
              (CBP One App), revoke deportation immunity, suspend refugee
              resettlement, and return Kamala’s illegal migrants to their home
              countries (also known as remigration). I will save our cities and
              towns in Minnesota, Wisconsin, Michigan, Pennsylvania, North
              Carolina, and all across America. #MAGA2024!
            </p>
            <div className="flex justify-between mt-4 text-xl">
              <div>
                <FaRegComment size={20} style={{"color":"#71767b"}} />
              </div>
              <div>
                <AiOutlineRetweet size={20} style={{"color":"#71767b"}}/>
              </div>
              <div>
                <CiHeart size={20} style={{"color":"#71767b"}}/>
              </div>
              <div>
                <VscGraph size={20} style={{"color":"#71767b"}}/>
              </div>
              <div>
                <div className="flex gap-2">
                  <CiBookmark size={20} style={{"color":"#71767b"}}/>
                  <GoUpload size={20} style={{"color":"#71767b"}}/>
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
