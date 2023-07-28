"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/schema";
import { CircleDashed, PlusIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";



type TableProps = {
  students: Database['public']['Tables']['students']['Row'][]
  teacherId: string
}

const StudentsTable = ({students, teacherId}:TableProps) => {

  const [loading, setLoading] = React.useState(false)

  const awardMerits = async (e:React.FormEvent<HTMLFormElement>) => {

      const supabase = createClientComponentClient<Database>();

    e.preventDefault()
    setLoading(true)
    const {points, type, student_id, profile_id} = Object.fromEntries(new FormData(e.currentTarget))

    console.log({points, type, student_id})

    if(typeof student_id !== 'string' || typeof type !== 'string' || typeof profile_id !== 'string') {
      toast({
        title: 'Error',
        description: 'Something went wrong: your inputs may be incorrect',
      })
      setLoading(false)
      return
    } else if( +points > 30 || +points < 1) {
      toast({
        title: 'Error',
        description: 'Points must be between 1 and 30',
      })
      setLoading(false)
      return
    }



    const { data, error } = await supabase.from("merits").insert([
      {
        points: +points,
        type,
        awarded_by: teacherId,
        student: student_id,
        profile_id: profile_id,
      },
    ]);

    if(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
      })
      setLoading(false)
      console.log({error})
    } else {
      toast({
        title: 'Success',
        description: 'Merits awarded successfully',
      })
      setLoading(false);
      return
    }


  }



  return (
    <div className="w-full">
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* <TableHead>Last Name</TableHead> */}
            <TableHead>School</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              className="text-xs text-stone-700 font-medium"
            >
              <TableCell>
                {student.profile.first_name} {student.profile.last_name}
              </TableCell>
              {/* <TableCell>{student.profile.last_name}</TableCell> */}
              <TableCell>{student.school.name}</TableCell>
              <TableCell>{student.profile.email}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon /> Add Merits
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Add Merits for {student.profile.first_name}{" "}
                        {student.profile.last_name}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={awardMerits} className="grid gap-4 py-4">
                      <div className="hidden">
                        <Label htmlFor="student_id" className="text-right">
                          Stduent
                        </Label>
                        <Input
                          type="text"
                          name="student_id"
                          id="student_id"
                          value={student.id}
                          // defaultValue={student.id}
                          className="col-span-3"
                        />
                      </div>
                      <div className="hidden">
                        <Label htmlFor="profile_id" className="text-right">
                          Stduent
                        </Label>
                        <Input
                          type="text"
                          name="profile_id"
                          id="profile_id"
                          value={student.profile.id}
                          // defaultValue={student.id}
                          className="col-span-3"
                        />
                      </div>
                      <div className="">
                        <Label htmlFor="points" className="text-right">
                          Points
                        </Label>
                        <Input
                          type="number"
                          name="points"
                          id="points"
                          min={1}
                          max={30}
                          defaultValue={0}
                          className="col-span-3"
                        />
                      </div>
                      <div className="mt-3">
                        <Select name="type">
                          <SelectTrigger>
                            <SelectValue placeholder="Select merits type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Merits Type</SelectLabel>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="social">Social</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mt-3">
                        <Button type="submit" className="w-2/3">
                          {loading ? (
                            <span className="flex items-center space-x-3">
                              <CircleDashed className="animate-spin" />{" "}
                              <p>Loading...</p>
                            </span>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default StudentsTable;
