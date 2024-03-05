'use client'
import Container from "@/components/Container";
import { UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import SearchInput from "@/components/SearchInput";
import { ModeToggle } from "@/components/theme-toogle";
import { NavMenu } from "./NavMenu";



const Navbar = () => {
    const router = useRouter()
    const {userId} = useAuth()
    return (
      <div className="sticky top-0 border border-b-primary/10 bg-secondary">
      <Container>
         <div className="flex justify-between items-center">
        <div className=" flex items-center gap-1 cursor-pointer" onClick= {() => router.push('/')}>
         <Image src='/logo1.png' alt='logo' width='30' height='30' />
         <div className="font-bold text-xl">RealVest</div>
        </div>
         <SearchInput />
        <div className="flex gap-3 items-center">
            <div className="">
              <ModeToggle/> 
              <NavMenu/>
            </div>
          <UserButton afterSignOutUrl="/" /> 
          {!userId && <>
           <Button onClick= {() => router.push('/sign-in')} variant='outline' size='sm'>Sign In</Button>
           <Button onClick= {() => router.push('/sign-up')}> Sign Up</Button>
          </>}
          </div>
         </div>
      </Container>
   </div>   
    );
} 

export default Navbar;