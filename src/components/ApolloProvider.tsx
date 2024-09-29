"use client"
import { apolloClient } from "@/clients/api";
import { ApolloProvider } from "@apollo/client";

export default function ProviderApollo({ children }: Readonly<{ children: React.ReactNode }>) {
    return ( 
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
};