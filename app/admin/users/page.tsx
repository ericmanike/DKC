import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { User as UserIcon, Calendar, Mail } from "lucide-react";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions as any);

    if (!session || session.user.role !== "admin") {
        redirect("/auth/login");
    }

    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900">Registered Users</h1>
                <p className="text-gray-600">Overview of all registered users on your platform.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100 text-left">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u: any) => (
                            <tr key={u._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <UserIcon className="h-5 w-5" />
                                        </div>
                                        <span className="font-bold text-gray-900">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Mail className="h-4 w-4 opacity-40" />
                                        {u.email}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400 text-xs font-medium">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
