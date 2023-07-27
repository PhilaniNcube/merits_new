"use client"

import { Button } from "@/components/ui/button";
import { Database } from "@/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Logout = () => {

   const supabase = createClientComponentClient<Database>();

    const logout = async () => {
      await supabase.auth.signOut();
    };

  return (
    <Button onClick={logout} type="button" className="w-full rounded-full bg-red-600">
      Log Out
    </Button>
  );
};
export default Logout;
