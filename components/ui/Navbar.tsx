"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import MobileNav from "./mobileNav";
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();


    const [isOpen, setIsOpen] = useState(false);

    return (<>
           <div className="bg-blue-600">    </div>
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/10 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className=" md:text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                           <span className="momo-signature-regular">DKC</span> Books<sub className="text-orange-700 momo-signature-regular">& courses</sub>
                          {/* <Image src="/ec.jpg" alt="User Avatar" width={100} height={100}  /> */}
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className={cn(" relative px-3 py-2 rounded-md  text-sm font-medium transition-all", pathname === "/" ? "text-blue-600  " : "hover:bg-gray-100 text-gray-700 hover:text-blue-600 after:absolute after:bottom-0  after:right-0 after:w-full after:h-0.5 after:bg-orange-500 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300   after:ease-out")}>
                                Home
                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
              aria-hidden="true"
        ></span>

                            </Link>
                            <Link href="/shop" className={cn(" relative px-3 py-2 rounded-md text-sm font-medium transition-all", pathname === "/shop" ? "text-blue-600 " : "text-gray-700 hover:text-blue-600 hover:bg-gray-100  after:absolute after:bottom-0  after:right-0 after:w-full after:h-0.5 after:bg-orange-500 after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300   after:ease-out")}>
                                Shop
                            </Link>
                            {session?.user.role === "admin" && (
                                <Link href="/admin/dashboard" className="relative px-3 py-2 rounded-md text-sm font-medium text-orange-700 hover:bg-red-50 transition-all after:absolute after:bottom-0  after:right-0 after:w-full after:h-0.5
                                 after:bg-orange-500 after:transform after:scale-x-0
                                  hover:after:scale-x-100 after:transition-transform after:duration-300   after:ease-out">
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            {session ? (
                                <div className="flex items-center space-x-4">
                                    <Link href="/dashboard" className="rounded-full bg-amber-600 p-3 px-4 flex items-center space-x-1 text-white hover:text-blue-600">
                                   
                                        <span className="text-sm font-medium">{session.user.name?.charAt(0)}</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="rounded   hover:border-blue-600 border  px-4 py-2 text-sm font-medium text-gray-700 hover:shadow-lg transition-all duration-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Login
                                    </Link>
                                    <Link href="/auth/register" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden border-blue-500 border-2 rounded-lg">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className=" z-50 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
         
    {/* Mobile Menu */}
          <div onClick={()=> setIsOpen(false)} className={`  fixed inset-0  bg-black/30 bg-opacity-50 z-20  h-screen md:hidden transition-transform duration-300 ease-in-out`}>

                <div className={`bg-white w-64 h-full shadow-lg  "fixed top-0 left-0 z-30 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>  
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            Home
                        </Link>
                        <Link href="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            Shop
                        </Link>
                    </div>
                    <div className="border-t  border-gray-200 pb-3 pt-4">
                        {session ? (
                            <div className="px-2 space-y-1">
                                <div className="px-3 py-2 text-base font-medium text-gray-800">
                                    {session.user.name}
                                </div>
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                    Dashboard
                                </Link>
                                {session.user.role === "admin" && (
                                    <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="px-2 space-y-1">
                                <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                    </div>
                </div>


       
               
         
        </nav>
        
          
        </>
    );
}
