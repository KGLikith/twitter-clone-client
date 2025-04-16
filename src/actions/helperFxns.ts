import { ApolloClient, NormalizedCacheObject, OperationVariables, TypedDocumentNode } from "@apollo/client";

export async function runTypedQuery<TData, TVariables extends OperationVariables>(
  client: ApolloClient<NormalizedCacheObject>,
  query: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<TData> {
  const { data } = await client.query({ query, variables });
  return data;
}

export async function runTypedMutation<TData, TVariables extends OperationVariables | undefined>(
  client: ApolloClient<NormalizedCacheObject>,
  mutation: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<TData> {
  const { data } = await client.mutate({ mutation, variables });
  return data!;
}


export const formatRelativeTime = (dateValue: string | number) => {
  let date: Date;

  if (typeof dateValue === "string") {
    if (/^\d+$/.test(dateValue)) {
      date = new Date(Number(dateValue));
    } else {
      date = new Date(dateValue);
    }
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
