import { apolloClient } from "@/clients/api";
import { deleteMediaMutation } from "@/graphql/mutation/tweet";
import { getSignedUrlforTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";

import { RefObject } from "react";
import { UseFormReturn } from "react-hook-form";

export const handleEmojiSelect = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  emoji: any,
  form: UseFormReturn<{ content: string }>,
  setShowEmojiPicker: (show: boolean) => void
) => {
  const textarea = textareaRef?.current;
  if (!textarea) return;

  const cursorPosition = textarea.selectionStart;
  const text = form.getValues("content") || "";
  const newText =
    text.slice(0, cursorPosition) + emoji.native + text.slice(cursorPosition);

  form.setValue("content", newText, { shouldValidate: false });

  // Focus back on textarea and set cursor position after emoji
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = cursorPosition + emoji.native.length;
    textarea.selectionEnd = cursorPosition + emoji.native.length;
  }, 0);

  setShowEmojiPicker(false);
};

export const searchGifs = async (
  gifSearchTerm: string,
  setGifs: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (!gifSearchTerm.trim()) return;

  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${
      process.env.NEXT_PUBLIC_GIPHY_API_KEY
    }&q=${encodeURIComponent(gifSearchTerm)}&limit=9`
  );
  const data = await response.json();
  setGifs(data.data || []);
};

export const handleGifSelect = async (
  gif: any,
  setMediaUploading: (show: boolean) => void,
  setShowGifPicker: (show: boolean) => void,
  setMediaUrl: (url: string) => void,
  setMediaType: (type: string) => void,
  mediaUrl: string | undefined | null,
  toast: any
) => {
  try {
    if(mediaUrl) {
      apolloClient.mutate({
        mutation: deleteMediaMutation,
        variables:{
          mediaUrl
        }
      })
    }
    const gifUrl = gif.images.fixed_height.url;

    const fileName = gifUrl.split("/").pop()?.split("?")[0] + Date.now() || "gif.gif";

    const response = await fetch(gifUrl);
    const blob = await response.blob();

    const file = new File([blob], fileName || "gif.gif", { type: "image/gif" });

    setMediaUploading(true);

    const { data } = await apolloClient.query({
      query: getSignedUrlforTweetQuery,
      variables: {
        mediaType: file.type,
        mediaName: file.name,
      },
    });

    const { getSignedURLForTweet } = data;
    if (getSignedURLForTweet) {
      await axios.put(getSignedURLForTweet, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const url = new URL(getSignedURLForTweet);
      setMediaUrl(url.pathname);
      setMediaType("image");
    }

    setShowGifPicker(false);
  } catch (error) {
    toast({ variant: "destructive", title: "Failed to add GIF" });
  } finally {
    setMediaUploading(false);
  }
};

export const formatTweetContent = (content: string) => {
  if (!content) return "";

  // hash
  let formattedContent = content.replace(
    /(^|\s)#([a-zA-Z0-9_]+)/g,
    '$1<a href="/hashtag/$2" class="text-orange-400 hover:underline">#$2</a>'
  );

  // url
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" class="text-blue-400  hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // mention
  formattedContent = formattedContent.replace(
    /(^|\s)@([a-zA-Z0-9_]+)/g,
    '$1<a href="/user/$2" class="text-orange-400 hover:underline">@$2</a>'
  );

  return formattedContent;
};
