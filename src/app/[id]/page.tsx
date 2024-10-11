import { NextPage } from "next/types";
import UserProfilePage from "./UserProfilePage";
import { Suspense } from "react";
import Skel from "@/components/normal_comp/Skeleton";
import Login from "@/components/app_components/LoginSide";

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const Page: NextPage<UserProfilePageProps> = ({ params }) => {
  // console.log(params)
  if(params.id== "not_authorised") return <div className="flex flex-col h-full w-full justify-center items-center gap-3"><h1 className="font-bold text-2xl">Sign in to view this page</h1><Login/></div>
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
