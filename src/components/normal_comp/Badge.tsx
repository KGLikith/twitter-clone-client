"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import { CiMenuKebab } from "react-icons/ci";


const Badge = () => {
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser || undefined);
    }
  }, [currentUser]);

  return (
    <>
      {user && (
        <div className="absolute bottom-5 flex gap-2 py-1 px-3 items-center hover:bg-gray-900 cursor-pointer transition-all w-[90%] rounded-full ">
          {user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt="Profile Image"
              width={40}
              height={40}
              className="rounded-full "
            />
          )}
            <div className="flex justify-between w-full items-center">
                <div>
                    <h3 className="text-white text-lg">
                        {user.firstName} {user.lastName}
                    </h3>
                    <h3 className="text-gray-400 text-sm">
                        @{user.firstName}
                        {user.lastName}
                    </h3>
                </div>
                <div>
                    <CiMenuKebab size={20} />
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Badge;