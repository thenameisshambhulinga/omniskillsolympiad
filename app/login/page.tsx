import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import LoginClient from "./LoginClient";

export default async function LoginPage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.warn("Ignoring invalid auth session on login page:", error);
  }

  if (session) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
