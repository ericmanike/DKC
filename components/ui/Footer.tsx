
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 border-t border-gray-800">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-white tracking-tighter font-outfit">DKC BOOKS</h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Empowering minds through premium educational resources. Your one-stop destination for curated books and professional courses.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-orange-500 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="text-orange-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-orange-500 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="text-orange-500 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Shop All</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/shop?category=Programming" className="hover:text-blue-400 transition-colors">Programming</Link></li>
                            <li><Link href="/shop?category=Business" className="hover:text-blue-400 transition-colors">Business</Link></li>
                            <li><Link href="/shop?category=Design" className="hover:text-blue-400 transition-colors">Design</Link></li>
                            <li><Link href="/shop?category=Marketing" className="hover:text-blue-400 transition-colors">Marketing</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>Kumasi, KNUST</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>053 5913039</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                                <span>digitalkindomchronicles@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Digital Kingdom Chronicles Books. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
