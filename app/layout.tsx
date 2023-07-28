import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Building2Icon, Coins, CoinsIcon, Home, PlaySquareIcon, StepForwardIcon, User } from 'lucide-react'
import "./globals.css";
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/schema';
import AuthWrapper from './login/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Fragment } from 'react';
import Logout from './Logout';


export const metadata = {
  title: 'Merits App',
  description: 'Merits App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const supabase = createServerComponentClient<Database>({ cookies })



const {data: {session}} = await supabase.auth.getSession()

const {data:profile, error} = await supabase.from('profiles').select('*').single()

const {data:student, error:student_error} = await supabase.from('students').select('*, profile(*), school(*)').eq('profile.id',profile?.id ).single()

const points = await supabase.rpc("my_total_points", {'student_id':student?.id!});

console.log(points)

const {data:school_admin, error:admin_error} = await supabase.rpc('is_school_admin').single()


  return (
    <html lang="en">
      <body className=" w-full">
        <nav className="sticky sm:hidden w-full px-2 py-3 border-b flex items-center">
          <Link href="/home" className="font-semibold hover:text-stone-700">
            Merits
          </Link>
          {session && (
            <div className="flex flex-1 justify-end items-center">
              <Logout />
            </div>
          )}
        </nav>
        <div className="flex h-screen w-full">
          <aside className="w-fit flex flex-col md:w-[200px] lg:w-[400px] p-2 md:p-4 lg:p-6 border-r ">
            <Link
              href="/home"
              className="hidden sm:flex font-semibold hover:text-stone-700"
            >
              Merits
            </Link>
            <Separator className="my-3 hidden sm:block" />
            <div className="mt-4">
              <Link
                href="/home"
                className="flex items-center space-x-4  py-2 rounded-lg hover:bg-stone-200 my-1"
              >
                <Home size={20} />
                <span className="hidden md:inline-block text-xl font-medium">
                  Home
                </span>
              </Link>
              {/* <Link
              href="/events"
              className="flex items-center space-x-4 px-3 py-2 rounded-lg hover:bg-stone-200 my-1"
            >
              <PlaySquareIcon size={20} />
              <span className="hidden md:inline-block text-xl font-medium">
                Events
              </span>
            </Link> */}
              {session && (
                <Fragment>
                  <Link
                    href="/my-school"
                    className="flex items-center space-x-4 py-2 rounded-lg hover:bg-stone-200 my-1"
                  >
                    <Building2Icon size={20} />
                    <span className="hidden md:inline-block text-xl font-medium">
                      My School
                    </span>
                  </Link>
                </Fragment>
              )}
            </div>
          </aside>
          <main className="flex-1 h-screen px-2 lg:px-0">
            <ScrollArea className="h-full">
              {!session ? <AuthWrapper /> : <>{children}</>}
            </ScrollArea>
          </main>
          <aside className="hidden sm:flex items-center w-fit flex-col border-l p-2 md:p-4 lg:p-6 md:w-[200px] bg-zinc-100 lg:w-[400px]">
            {session && (
              <div className="w-full flex flex-col items-center">
                <Logout />
                <div className="w-full mt-2">
                  <section className="flex w-full items-center space-x-3">
                    <Avatar className="flex ">
                      <AvatarImage
                        src={profile?.avatar_url}
                        alt={session.user.user_metadata.first_name}
                      />
                      <AvatarFallback>
                        {profile?.first_name[0]}
                        {profile?.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-lg flex flex-col font-medium">
                      <h2>{profile?.first_name}</h2>
                      <p className="text-xs">{profile?.email}</p>
                      <p className="text-xs">Total Merits: {points.data}</p>
                    </span>
                  </section>
                  <Separator className="my-3" />
                  <div className="flex flex-col space-y-3 w-full">
                    <Link
                      href="/profile"
                      className="flex space-x-2 items-center px-4 py-2  hover:bg-stone-200 text-stone-700 w-fit"
                    >
                      <User /> My Profile
                    </Link>
                    {school_admin && (
                      <Link
                        href="/merits"
                        className="flex space-x-2 items-center px-4 py-2  hover:bg-stone-200 text-stone-700 w-fit"
                      >
                        <Coins /> Merits
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
