'use client ';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
function mobileNav({isOpen}: {isOpen: boolean}) {

    const { data: session } = useSession();




  return (
   
  )
}

export default mobileNav