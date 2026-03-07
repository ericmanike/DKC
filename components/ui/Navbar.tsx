"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";



export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();


    const [isOpen, setIsOpen] = useState(false);

    return (<>
        <div className="bg-blue-600">    </div>
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/93  shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="md:text-3xl font-black text-orange-600 font-outfit tracking-tighter">
                            DKC BOOKS.
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
                                <div className="flex items-center space-x-6">
                                    <Link
                                        href="/dashboard"
                                        className="hidden sm:flex items-center gap-3 group transition-all"
                                    >
                                        <div className="relative h-10 w-10 flex-shrink-0">
                                            <div className="h-full w-full rounded-full bg-orange-100 border-2 border-orange-500 overflow-hidden flex items-center justify-center text-orange-600 font-black text-sm shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
                                                {session.user.image ? (
                                                    <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{session.user.name?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Dashboard</span>
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{session.user.name?.split(' ')[0]}</span>
                                        </div>
                                    </Link>
                                    <Link href="/dashboard" className="sm:hidden flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-bold shadow-sm">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-100 hover:border-red-100 transition-all active:scale-95"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href="/auth/login" className="text-sm font-medium  px-6 py-2 rounded-[10px] bg-blue-600 text-white hover:text-gray-200">
                                        Login
                                    </Link>
                                    {/* <Link href="/auth/register" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                                            Sign Up
                                        </Link> */}
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

            {/* Mobile Menu with Framer Motion */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-[280px] h-full bg-white z-[60] shadow-2xl md:hidden overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-black text-orange-600 tracking-tighter">
                                    DKC BOOKS.
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 space-y-6">
                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Navigation</p>
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all",
                                            pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <User size={18} className={pathname === "/" ? "text-blue-500" : "text-gray-400"} />
                                        Home
                                    </Link>
                                    <Link
                                        href="/shop"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all",
                                            pathname === "/shop" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <Menu size={18} className={pathname === "/shop" ? "text-orange-500" : "text-gray-400"} />
                                        Shop
                                    </Link>
                                </div>

                                {/* Account Section */}
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Account</p>
                                    {session ? (
                                        <div className="space-y-2">
                                            <div className="px-4 py-3 bg-gray-50 rounded-2xl flex items-center gap-3 mb-4">
                                                <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
                                                    {session.user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-black text-gray-900 truncate">{session.user.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase truncate">{session.user.email}</span>
                                                </div>
                                            </div>

                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 transition-all border border-transparent"
                                            >
                                                <User size={18} className="text-gray-400" />
                                                My Dashboard
                                            </Link>

                                            {session.user.role === "admin" && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent"
                                                >
                                                    <Menu size={18} className="text-red-400" />
                                                    Admin Panel
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    signOut();
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all group"
                                            >
                                                <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Link
                                                href="/auth/login"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/auth/register"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center justify-center w-full px-4 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer info */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">&copy; 2024 DKC BOOKS.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>





        </nav>


    </>
    );
}
