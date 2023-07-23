import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Database } from "@/schema";
import { createServerActionClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { HeartIcon, Speaker, Text } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type PostProps = {
  post: Database['public']['Tables']['posts']['Row'];
}

const Post = async ({post}:PostProps) => {

 const supabase = createServerComponentClient<Database>({ cookies });

 const {data: post_likes, error, count} = await supabase.from("post_likes").select("*", {count: "exact"}).eq("post_id", post.id)

 const addLike = async (formData: FormData) => {
   "use server";
   const post_id = formData.get("post_id");
   const profile_id = formData.get("profile_id");

   if(typeof post_id !== "string" || typeof profile_id !== "string") return;

   if (post_id) {
     // Create a Supabase client configured to use cookies
     const supabase = createServerActionClient({ cookies });

     // This assumes you have a `todos` table in Supabase. Check out
     // the `Create Table and seed with data` section of the README 👇
     // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
     await supabase.from("post_likes").insert([{
      post_id,
      profile_id
     }]);
     revalidatePath("/home");
   }
 };



  return (
    <div className="w-full">
      <div className="w-full py-3 flex items-start space-x-3 px-3">
        <Avatar className="flex ">
          <AvatarImage
            src={post.profile.avatar_url}
            alt={post.profile?.first_name}
          />
          <AvatarFallback>
            {post.profile?.first_name[0]}
            {post.profile?.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <small className="text-xs tex-stone-500">
            {post.profile?.first_name} {post.profile?.last_name}
          </small>
          <h2 className="text-md font-semibold">{post.title}</h2>
          <p className="text-sm leading-7">{post.description}</p>
        </div>
      </div>
      <div className="border-t py-2 px-3 flex justify-start space-x-4 items-center">
        <form action={addLike} className="flex items-center space-x-2">
          <Button variant="ghost" className="bg-transparent hover:bg-transparent">
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="profile_id" value={post.profile.id} />
            <HeartIcon
              size={24}
              className="text-stone-500 hover:text-red-500"
            />
          </Button>
          <p className="text-xs text-stone-400">{count ? count : 0} likes</p>
        </form>
        <div className="flex items-center space-x-2">
          <Text size={24} className="text-stone-500 hover:text-red-500" />
          <p className="text-xs text-stone-400">0 comments</p>
        </div>
      </div>
    </div>
  );
};
export default Post;
