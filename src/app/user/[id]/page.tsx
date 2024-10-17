import { NextPage } from "next/types";
import UserProfilePage from "./UserProfilePage";
import { Suspense } from "react";
import Skel from "@/components/normal_comp/Skeleton";

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const Page: NextPage<UserProfilePageProps> = ({ params }) => {
  // console.log(params)
  if (!params.id) return null;
  return (
    <>
        <Suspense fallback={<Skel />}>
          <UserProfilePage id={params.id} />
        </Suspense>
    </>
  );
};

export default Page;
