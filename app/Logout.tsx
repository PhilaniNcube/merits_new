"use client"

import { Button } from "@/components/ui/button";
import { Database } from "@/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserMinus2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Logout = () => {

  const router = useRouter()

   const supabase = createClientComponentClient<Database>();

    const logout = async () => {
      await supabase.auth.signOut();
      router.refresh();
    };

  return (
    <Button
      onClick={logout}
      type="button"
      className="w-fit sm:w-full flex items-center space-x-3 py-1 justify-center rounded-full bg-red-600"
    >
      <UserMinus2 size={24} /> <span className="flex">Log Out</span>
    </Button>
  );
};
export default Logout;
