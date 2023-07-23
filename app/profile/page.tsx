import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/schema";
import { createServerActionClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { revalidatePath } from "next/cache";

const page = async () => {

  const supabase = createServerComponentClient<Database>({ cookies });

  const {data: {session}} = await supabase.auth.getSession()

  // fetch the schools from the schools table
  const { data: schools, error } = await supabase.from("schools").select("*").order("name", { ascending: true });

    const updateProfile = async (formData: FormData) => {
      "use server";

      // get the values from the form
      const school_id = formData.get("school");
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const supabase = createServerActionClient({ cookies });

      const { data: profile, error: profile_error } = await supabase
        .from("profiles")
        .update({ first_name, last_name, updated_at: new Date() })
        .eq("id", session?.user.id)
        .select("*");

        const {data:student_search, error:student_search_error} = await supabase.from("students").select("*").eq("profile", session?.user.id).single()

        if(student_search){
        const {data, error} =  await supabase.from("students").update({school: school_id}).eq("profile", session?.user.id).select('*')
        if(error) console.log(error.message)
        if(data) {
          console.log("updating student", data)
        }
      } else {
           const { data: students, error: student_error } = await supabase
             .from("students")
             .upsert({ school: school_id, profile: session?.user.id })
             .select("*");

           console.log({ profile, students });
        }

      revalidatePath("/profile");
    };

  return (
    <div className="mt-2 container">
      <div className="flex justify-between flex-1 w-full gap-2 px-">
        <Button>New Post</Button>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full gap-2 mt-8">
        <h2>Update My Profile</h2>
        <form action={updateProfile} className="w-full @container">
          <div className="grid grid-cols-1 @md:grid-cols-2 @md:gap-x-3">
            <div className="my-2 ">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                defaultValue={session?.user.user_metadata.first_name}
              />
            </div>
            <div className="my-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                defaultValue={session?.user.user_metadata.last_name}
              />
            </div>
          </div>
          <div className="my-2">
            <Select name="school">
              <SelectTrigger className="w-full max-w-[500px]">
                <SelectValue placeholder="Select your school" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <ScrollArea className="h-[200px]">
                    <SelectLabel>Schools</SelectLabel>
                    {schools?.map((school) => (
                      <SelectItem value={school.id}>
                        <span className="flex space-x-2">
                          <p>{school.name}</p>
                          <Separator
                            orientation="vertical"
                            className="text-black bg-black"
                          />
                          <small>{school.city}</small>
                        </span>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full max-w-[500px] mt-3">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};
export default page;
