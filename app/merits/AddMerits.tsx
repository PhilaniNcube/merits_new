"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Check, ChevronsUpDown, CircleDashed } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  student_id: z.string(),
  points: z.string(),
  type: z.string(),
});

type Props = {
  students: Database["public"]['Tables']['students']['Row'][];
  types: Database["public"]['Tables']['merits_type']['Row'][];
}

const AddMerits = ({students, types}:Props) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  console.log({students, types})


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


  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(data);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
      });
      reset({ student_id: "" });
      return;
    }

    const { data: post, error } = await supabase
      .from("merits")
      .insert([
        {
          awarded_by: session?.user.id,
          student: data.student_id,
          type: data.type,
          points: +data.points,
        },
      ])
      .select("*");

    if (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
      });
      reset({ student_id: "", points: "", type: "" });
      setLoading(false);
      return;
    } else if (post) {
      toast({
        title: "Success",
        description: "Post created",
      });
      reset({ student_id: "",  points: "", type: "" });
      setLoading(false);
      router.refresh();
      return;
    }
    // const interval = setTimeout(() => {
    //   setLoading(false);
    // }, 2000);

    // return () => clearInterval(interval);
  }

  return (
    <div className="w-full border-b py-2 px-3">
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
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.map((student) => (
                            <SelectItem value={student.id}>{student.id}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full my-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merits Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of merits" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types?.map((type) => (
                            <SelectItem value={type.id}>{type.id}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button className="w-6/12 mt-3" type="submit">
                  {loading ? (
                    <span className="flex space-x-2">
                      <CircleDashed size={16} className="animate-spin" />
                      <p>Saving...</p>
                    </span>
                  ) : (
                    <span>Save Merits</span>
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
export default AddMerits;
