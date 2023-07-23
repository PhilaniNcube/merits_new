"use client"

import {useState} from "react"
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Button } from "@/components/ui/button";

const AuthWrapper = () => {

  const [authView, setAuthView] = useState<"sign-in" | "sign-up">("sign-in")

  return (
    <div className="w-full">
      <>
       {authView === "sign-in" ? <SignIn /> : <SignUp />}
      </>
      <div className="w-full flex justify-center mt-4">
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            if (authView === "sign-in") {
              setAuthView("sign-up");
            } else {
              setAuthView("sign-in");
            }
          }}
        >
          {authView === "sign-in" ? "If you don't have an account. Sign Up!" : "If you already have an account. Sign In!"}
        </Button>
      </div>
    </div>
  );
};
export default AuthWrapper;
