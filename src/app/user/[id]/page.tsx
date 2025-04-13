// app/user/[id]/page.tsx
import { Suspense } from "react";
import Skel from "@/components/normal_comp/Skeleton";
import UserProfilePage from "./UserProfilePage";

interface UserPageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params
}:
  Readonly<{
    children: React.ReactNode;
    params: { id: string }
  }>) => {
  const {id} =await params;

  return (
    <Suspense fallback={<Skel />}>
      <UserProfilePage id={id} />
    </Suspense>
  );
};

export default Page;
