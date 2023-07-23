"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import slugify from "slugify";
import { CircleDashedIcon } from "lucide-react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  first_name: z.string({
    required_error: "First name is required",
  }).min(2,
    {
    message: "First name must be at least 2 characters long",
  }),
  last_name: z.string({
    required_error: "Last name is required",
  }).min(2,
    {
    message: "Last name must be at least 2 characters long",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
})

const SignUp = () => {

  const supabase = createClientComponentClient<Database>();

  const router = useRouter();

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });

    const {handleSubmit, register, resetField, reset, getFieldState, clearErrors, formState} = form


    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      setLoading(true);

      const files = e.target.files;

      const file = files?.[0];

      if (!file) {
        toast({
          title: "Error",
          description: "No file uploaded",
        });
        return;
      }

      const filename =
        slugify(file.name.split(".")[0], {
          lower: true,
        }) +
        "_" +
        Math.ceil(Math.random() * 25);

        const fileExtension = file.name.split(".").pop();

        const uploadName = filename + "." + fileExtension;

         const { data, error } = await supabase.storage
           .from("avatars")
           .upload(uploadName, file);

         if (error) {
           console.log(error);
           setLoading(false);
           return
         }
         if(data) {
           //https://kktstzsxntooizwpijko.supabase.co/storage/v1/object/sign/avatars/aerial.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlcmlhbC5qcGciLCJpYXQiOjE2ODk1NDQzNDMsImV4cCI6MTY5MDE0OTE0M30.APojfOfJ9uMd_4L84QB-3OsrDD6CbzK6_RfVGJ6EFvU&t=2023-07-16T21%3A52%3A23.068Z
           const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`;

           setImage(`${url}${data.path}`);
           setLoading(false);
           return;
         }

    };


    async function onSubmit(data:z.infer<typeof formSchema>) {
      console.log(data)

      const {data: user, error} = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            avatar_url: image,
          }
        }
      })

      if(error) {
        toast({
          title: 'Error',
          description: `${error.message} ${error.cause}`,
        })
      } else {
        toast({
          title: 'Success',
          description: 'Check your email for the confirmation link',
        })
        router.push('/')
      }
    }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto"
      >
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        <div className="flex flex-col w-full my-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full my-2">
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full my-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="joe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full my-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full my-2">
          <Label htmlFor="avatar">Profile Image</Label>
          <Input type="file" onChange={handleImageUpload} />
        </div>
        <Button type="submit" className="w-full">
          {loading && <CircleDashedIcon className="animate-spin text-white" />}{" "}
          {loading ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};
export default SignUp;
