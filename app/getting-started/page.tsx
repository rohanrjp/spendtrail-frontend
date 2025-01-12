"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LandingNavbar } from "@/components/landing-navbar"
import dynamic from 'next/dynamic'
import { setToken } from "@/utils/auth"

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  avatar: z.string().emoji({ message: "Please select a valid emoji for your avatar" }),
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function GettingStartedPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      avatar: "👤",
    },
  })

  const onSubmit = async (data: SignUpValues) => {
    setError(null)
    try {
      const response = await fetch("https://spendtrail-backend.onrender.com/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
 
      if (response.ok) {
        const responseData = await response.json()
        setToken(responseData.access_token)
        router.push("/sign-in")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "An error occurred during sign up")
      }
    } catch (err) {
      setError("An error occurred during sign up")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create an account to get started with SpendTrail</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {watch("avatar")}
                  </Button>
                  {errors.avatar && <p className="text-sm text-red-500">{errors.avatar.message}</p>}
                  {showEmojiPicker && (
                    <div className="mt-2 max-h-[200px] overflow-y-auto">
                      <EmojiPicker
                        onEmojiClick={(emojiObject) => {
                          setValue("avatar", emojiObject.emoji)
                          setShowEmojiPicker(false)
                        }}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}
                </div>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600" type="submit">Sign Up</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

