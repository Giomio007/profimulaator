// app/actions/login.js
"use server";

import { signIn } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function authenticate(formData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid credentials" };
    }
    throw error;
  }

  redirect("/dashboard");
}
