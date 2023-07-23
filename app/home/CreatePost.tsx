"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { CircleDashed } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const CreatePost = () => {

  const supabase = createClientComponentClient<Database>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

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
            .from("posts")
            .upload(uploadName, file);

          if (error) {
            console.log(error);
            setLoading(false);
            return;
          }
          if (data) {
            //https://kktstzsxntooizwpijko.supabase.co/storage/v1/object/sign/avatars/aerial.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlcmlhbC5qcGciLCJpYXQiOjE2ODk1NDQzNDMsImV4cCI6MTY5MDE0OTE0M30.APojfOfJ9uMd_4L84QB-3OsrDD6CbzK6_RfVGJ6EFvU&t=2023-07-16T21%3A52%3A23.068Z
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/`;

            setImage(`${url}${data.path}`);
            setLoading(false);
            return;
          }
        };


    async function onSubmit(data: z.infer<typeof formSchema>) {
      setLoading(true);
      console.log(data);

      const {data:{session}} = await supabase.auth.getSession()

      if(!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
        });
        reset({ title: "", description: "" });
        return
      }

      const { data: post, error } = await supabase.from("posts").insert([{
        title: data.title,
        description: data.description,
        image: image,
        profile: session?.user.id,
      }]).select("*");

      if (error) {
        console.log(error);
        toast({
          title: "Error",
          description: error.message,
        })
        reset({ title: "", description: "" });
        setLoading(false);
        return;
      } else if (post) {
        toast({
          title: "Success",
          description: "Post created",
        })
        reset({title: '', description: ''});
        setLoading(false);
        router.refresh()
        return;
      }
      // const interval = setTimeout(() => {
      //   setLoading(false);
      // }, 2000);

      // return () => clearInterval(interval);
    }


  return (
    <div className="sticky top-0 z-30 bg-white w-full border-b py-2 px-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Post</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
            <DialogDescription>
              Tell your friends whats up. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full my-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Post title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full my-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mb-1">Post Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className=""
                          placeholder="Create Post..."
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full my-4">
                <Label htmlFor="avatar" className="mb-2">
                  Post Image
                </Label>
                <Input type="file" onChange={handleImageUpload} />
              </div>
              <DialogFooter>
                <Button className="w-6/12 mt-3" type="submit">
                  {loading ? (
                    <span className="flex space-x-2">
                      <CircleDashed size={16} className="animate-spin" />
                      <p>Save Post</p>
                    </span>
                  ) : (
                    <span>Save Post</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CreatePost;
