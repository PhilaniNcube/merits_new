import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Home, StepForwardIcon, User } from 'lucide-react'
import "./globals.css";
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/schema';
import AuthWrapper from './login/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';


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

  return (
    <html lang="en">
      <body className="flex h-screen w-full">
        <aside className="w-fit flex flex-col md:w-[200px] lg:w-[400px] p-2 md:p-4 lg:p-6 border-r ">
          <Link href="/" className="font-semibold hover:text-stone-700">
            Merits
          </Link>
          <Separator className="my-3" />
          <div className="mt-4">
            <Link
              href="/home"
              className="flex items-center space-x-4 px-3 py-2 rounded-lg hover:bg-stone-200 my-1"
            >
              <Home size={24} />
              <span className="hidden md:inline-block text-xl font-medium">
                Home
              </span>
            </Link>
            <Link
              href="/events"
              className="flex items-center space-x-4 px-3 py-2 rounded-lg hover:bg-stone-200 my-1"
            >
              <StepForwardIcon size={24} />
              <span className="hidden md:inline-block text-xl font-medium">
                Events
              </span>
            </Link>
          </div>
        </aside>
        <main className="flex-1 h-screen">
          <ScrollArea className="h-full">
          {!session ? <AuthWrapper /> : <>{children}</>}
          </ScrollArea>
        </main>
        <aside className="hidden sm:flex items-center w-fit flex-col border-l p-2 md:p-4 lg:p-6 md:w-[200px] bg-zinc-100 lg:w-[400px]">
          {session && (
            <div className="w-full flex flex-col items-center">
              <Button className="w-full rounded-full bg-red-600">
                Log Out
              </Button>
              <div className="w-full mt-2">
                <section className="flex w-full items-center space-x-3">
                  <Avatar className="flex ">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={session.user.user_metadata.first_name}
                    />
                    <AvatarFallback>
                      {session.user.user_metadata.first_name[0]}
                      {session.user.user_metadata.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-lg flex flex-col font-medium">
                    <h2>{session.user.user_metadata.first_name}</h2>
                    <p className="text-xs">{profile?.email}</p>
                  </span>
                </section>
                <Separator className="my-3" />
                <div className="flex flex-col space-y-2 w-full">
                 <Link href="/profile" className="flex space-x-2 items-center px-4 py-2 rounded-full hover:bg-stone-200 text-stone-700 shadow-md"><User /> My Profile</Link>
                </div>
              </div>
            </div>
          )}
        </aside>

        <Toaster />
      </body>
    </html>
  );
}
