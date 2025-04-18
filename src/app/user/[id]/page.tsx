// app/user/[id]/page.tsx
import { Suspense } from "react";
import UserProfilePage from "./UserProfilePage";
import UserSkel from "@/components/global/Skeleton/UserSkeleton";

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
    <Suspense fallback={<UserSkel />}>
      <UserProfilePage id={id} />
    </Suspense>
  );
};

export default Page;
