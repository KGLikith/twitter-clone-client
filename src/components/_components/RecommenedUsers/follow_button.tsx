'use client'
import { FollowUser } from '@/actions/follow_unfollow';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react'

type Props = {
    rec_userId: string;
    currentUserId: string;
}

export default function FollowButton({ rec_userId, currentUserId}: Props) {
    const queryclient = useQueryClient();
    const [loadingButton, setloadingButton] = React.useState(false)

    const handleFollowUser = async () => {
        await FollowUser(currentUserId, rec_userId, setloadingButton, queryclient);
        queryclient.invalidateQueries({ queryKey: ["currentUserById", currentUserId] });
      }
    return (
        <div>
            {loadingButton ? (
                <Button
                    disabled
                    variant={"ghost"}
                    className="rounded-full font-bold px-4 py-1 flex justify-center items-center"
                >
                    <Loader2 className=" h-4 w-4 animate-spin text-center" />
                </Button>
            ) : (
                <div>
                    <Button
                        variant={"ghost"}
                        className="rounded-full font-bold px-4"
                        onClick={() => handleFollowUser()}
                    >
                        Follow
                    </Button>
                </div>
            )}
        </div>
    )
}