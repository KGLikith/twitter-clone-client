import {  NextPage } from "next/types";
import UserProfilePage from "./UserProfilePage";
import TwitterLayout from "@/components/Layout/TwitterLayout";

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const Page: NextPage<UserProfilePageProps> = ({ params }) => {
  // console.log(params)
  if(!params.id) return null;
  return (
    <>
    <TwitterLayout>
      <UserProfilePage id={params.id} />
    </TwitterLayout>
    </>
  );
};


export default Page;
