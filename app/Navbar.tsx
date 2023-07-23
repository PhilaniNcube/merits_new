import { Database } from "@/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import AccountDropdown from "./AccountDropdown";

const Navbar = async () => {

    const supabase = createServerComponentClient<Database>({ cookies });

    const {data: {user}} = await supabase.auth.getUser();

  return <div className="border-b py-2 container w-full">
      <div className="w-full flex justify-between">
        <Link href="/" className="font-semibold text-zinc-600">Merits</Link>
        <div>
          {user ? <AccountDropdown /> : <Link href="/login">Login</Link>}
        </div>
      </div>
  </div>;
};
export default Navbar;
