import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const page = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {data: {session}} = await supabase.auth.getSession();

  const {data:student_account, error:student_account_error} = await supabase.from('students').select(`*, profile(*), school(*)`).eq('profile.id', session?.user.id).single();



  return (
    <div className="px-3 py-2">
      <h1 className="text-lg font-semibold">
        {/* <pre>{JSON.stringify(student_account, null, 2)}</pre> */}
        {student_account?.school?.name}
      </h1>
      <Separator className="my-3" />
    </div>
  );
};
export default page;
