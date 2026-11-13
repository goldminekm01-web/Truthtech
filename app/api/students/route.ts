import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

interface Student {
    id: string;
    email: string;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    form: string | null;
    school: string | null;
    role: string;
    enrolled_courses: string[];
    certificates: any[];
    progress: Record<string, number>;
    created_at: string;
    updated_at: string;
}

// Admin password from environment (supports both local and Vercel)
const VALID_TOKENS = [
    process.env.ADMIN_PASSWORD || "antigravity2024",
    "Yusto2025@", // Local admin password
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || ""
].filter(Boolean);

function isValidToken(token: string | null | undefined): boolean {
    if (!token) return false;
    return VALID_TOKENS.some(valid => valid === token);
}

export async function GET(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token") || 
                          request.headers.get("Authorization")?.replace("Bearer ", "") || null;
        
        if (!isValidToken(adminToken)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.orderBy("created_at", "desc").get();
        
        const students: Student[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Student, 'id'>)
        }));

        return NextResponse.json({ students });
    } catch (error) {
        console.error("Error in students GET:", error);
        return NextResponse.json({ students: [], error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token") || 
                          request.headers.get("Authorization")?.replace("Bearer ", "") || null;
        
        if (!isValidToken(adminToken)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const studentData = await request.json();
        
        const newStudent = {
            email: studentData.email || "",
            full_name: studentData.full_name || null,
            first_name: studentData.first_name || null,
            last_name: studentData.last_name || null,
            phone: studentData.phone || null,
            form: studentData.form || null,
            school: studentData.school || null,
            role: studentData.role || "student",
            enrolled_courses: [], // Always empty on creation - FIX for fake data
            certificates: [], // Always empty on creation - FIX for fake data
            progress: {}, // Always empty on creation
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const docRef = await db.collection("students").add(newStudent);
        
        return NextResponse.json({ 
            student: { id: docRef.id, ...newStudent },
            success: true 
        });
    } catch (error) {
        console.error("Error in students POST:", error);
        return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token") || 
                          request.headers.get("Authorization")?.replace("Bearer ", "") || null;
        
        if (!isValidToken(adminToken)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, ...updates } = await request.json();
        
        if (!id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        const studentRef = db.collection("students").doc(id);
        
        // Ensure empty arrays/objects for fake data - FIX for displaying fake counts
        const updateData = {
            ...updates,
            enrolled_courses: updates.enrolled_courses ?? [],
            certificates: updates.certificates ?? [],
            progress: updates.progress ?? {},
            updated_at: new Date().toISOString()
        };

        await studentRef.update(updateData);
        
        const updatedDoc = await studentRef.get();
        return NextResponse.json({ 
            success: true, 
            student: { id, ...(updatedDoc.data() as Omit<Student, 'id'>) } 
        });
    } catch (error) {
        console.error("Error in students PUT:", error);
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token") || 
                          request.headers.get("Authorization")?.replace("Bearer ", "") || null;
        
        if (!isValidToken(adminToken)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        
        if (!id) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        await db.collection("students").doc(id).delete();

        return NextResponse.json({ success: true, message: "Student deleted" });
    } catch (error) {
        console.error("Error in students DELETE:", error);
        return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
    }
}