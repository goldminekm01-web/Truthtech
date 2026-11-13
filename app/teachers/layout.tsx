import Link from "next/link";
import { FileText, Home, BarChart3, Users, Settings } from "lucide-react";

export default function TeachersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
                                <Home className="w-5 h-5" />
                                <span className="font-bold">Lazarus</span>
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">Teachers</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/teachers/exams" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Exams & Papers
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}