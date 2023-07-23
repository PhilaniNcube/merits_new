"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDashedIcon } from "lucide-react";


const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

const SignUp = () => {
  const supabase = createClientComponentClient<Database>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    resetField,
    reset,
    getFieldState,
    clearErrors,
    formState,
  } = form;


  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(data);

    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
      setLoading(false)
    } else {
      toast({
        title: "Success",
        description: "You are now logged in!",
      });
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>


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

        <Button  type="submit" className="w-full flex space-x-3">
         {loading && <CircleDashedIcon className="animate-spin text-white" />} {loading ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};
export default SignUp;
