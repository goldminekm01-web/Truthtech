"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeachersIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/teachers/exams");
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
            </div>
        </div>
    );
}