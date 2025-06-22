import { apolloClient } from "@/clients/api";
import { CallType } from "@/gql/graphql";
import { startCallMutation } from "@/graphql/mutation/user";
import { getConversationByUserIdQuery } from "@/graphql/query/user";
import { toast } from "sonner";

export const startCall = async (
  type: CallType,
  participants: string[],
  conversationId: string
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: startCallMutation,
      variables: {
        type,
        participants,
        conversationId,
      },
    });
    return data?.startCall;
  } catch (error) {
    console.error("Error starting call:", error);
    toast.error("Failed to start the call. Please try again later.", {
      duration: 2000,
      description: "An error occurred while starting the call.",
    });
  }
};

export const getConversationUser = async(userId: string) => {
  const {
    data: { getConversationByUserId },
  } = await apolloClient.query({
    query: getConversationByUserIdQuery,
    variables: {
      userId: userId,
    },
  });
  return getConversationByUserId
};


export function getVolumeFromStream(stream: MediaStream): { analyser: AnalyserNode | null, getVolume: () => number } {
  try{
    const audioCtx = new window.AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
  
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
  
    const getVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      return volume;
    };
  
    return { analyser, getVolume };

  }catch(err){
    console.log("Error getting volume from stream:", err);
    return {
      analyser: null,
      getVolume: () => 0,
    };
  }
}
