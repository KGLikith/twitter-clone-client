'use server'

import { signIn } from "@/auth";

export const checkUser = async (email: string, password: string) => {
  
};


export const addUser = async (
  email: string,
  password: string,
  name: string
) => {
  
};

export async function signInUser(email: string, password: string) {
  try {
    // const result = await checkUser(email, password);
    // if (!result.success) {
    //   return {
    //     success: false,
    //     message: result.message,
    //   };
    // }
    await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    return {
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
