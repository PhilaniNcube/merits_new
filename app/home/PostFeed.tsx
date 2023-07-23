import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Post from "./Post";

const PostFeed = async () => {

  const supabase = createServerComponentClient({ cookies });

  const { data: posts, error } = await supabase.from("posts").select("*, profile(*)");

  return (
    <div className="w-full mt-4">
      {error || posts.length === 0 ? (
        <div className="w-full border-b py-2 px-3">
          <p className="text-lg text-stone-700">No Posts</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id} className="w-full border-b ">
             <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PostFeed;
