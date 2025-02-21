"use server"

import { signIn } from "next-auth/react"

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      return "Invalid credentials."
    }

    return undefined
  } catch (error) {
    console.error("Authentication error:", error)
    return "Something went wrong."
  }
}

