import { Database } from "@/schema";
import AddMerits from "./AddMerits";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import StudentsTable from "./StudentsTable";

const page = async () => {

 const supabase = createServerComponentClient<Database>({ cookies });
 const {
   data: { session },
 } = await supabase.auth.getSession();

 const {data:teacher, error:teacher_error} = await supabase.from('teachers').select('*, profile(*), school(*)').eq('profile.id', session?.user.id).single()

 const { data: students, error } = await supabase.from("students").select("*, profile(*), school(*)")


  return <div>
   <div className="w-full border-b py-2 px-3 sticky top-0">
      <h1 className="text-lg font-semibold">Awarding Merits</h1>
   </div>
    <div className="px-3 py-2">
      <StudentsTable students={students!} teacherId={teacher?.id!} />
    </div>
  </div>;
};
export default page;
