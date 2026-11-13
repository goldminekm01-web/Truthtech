import { NextRequest, NextResponse } from "next/server";

interface Document {
    id: string;
    title: string;
    description: string;
    category: string;
    fileUrl: string;
    fileType: 'pdf' | 'doc' | 'docx' | 'txt';
    fileSize: string;
    publishAt: string;
    slug: string;
    downloadCount: number;
    updatedAt?: string;
}

// In-memory storage
let documents: Document[] = [];

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "antigravity2024";

export async function GET() {
    try {
        const now = new Date().toISOString();
        const publishedDocs = documents.filter(d => new Date(d.publishAt) <= new Date(now));
        
        return NextResponse.json({
            documents: publishedDocs,
            total: publishedDocs.length
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ documents: [], error: "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const adminToken = request.headers.get("Authorization")?.replace("Bearer ", "") || 
                          request.headers.get("X-Admin-Token");
        
        const isAdmin = adminToken === ADMIN_PASSWORD || adminToken === sessionStorage?.getItem?.("admin_token");
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        
        const title = formData.get("title") as string || "";
        const description = formData.get("description") as string || "";
        const category = formData.get("category") as string || "exams-papers";
        const file = formData.get("file") as File;
        const publishAt = formData.get("publishAt") as string || new Date().toISOString();
        
        if (!file || !title) {
            return NextResponse.json({ error: "Title and file are required" }, { status: 400 });
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const fileType = file.name.split(".").pop()?.toLowerCase() || "pdf";
        const validType = ["pdf", "doc", "docx", "txt"].includes(fileType) ? fileType : "pdf";
        const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newDoc: Document = {
            id,
            title,
            description,
            category,
            fileType: validType as 'pdf' | 'doc' | 'docx' | 'txt',
            fileUrl: `/content/documents/${slug}.${validType}`,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            publishAt,
            slug,
            downloadCount: 0
        };

        documents.push(newDoc);
        
        return NextResponse.json({ 
            success: true, 
            document: newDoc,
            message: "Document uploaded successfully" 
        });
    } catch (error) {
        console.error("Error uploading document:", error);
        return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token");
        
        if (adminToken !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, title, description, category, publishAt } = await request.json();
        
        const docIndex = documents.findIndex(d => d.id === id);
        if (docIndex === -1) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        documents[docIndex] = {
            ...documents[docIndex],
            title: title || documents[docIndex].title,
            description: description !== undefined ? description : documents[docIndex].description,
            category: category || documents[docIndex].category,
            publishAt: publishAt || documents[docIndex].publishAt,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({ success: true, document: documents[docIndex] });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const adminToken = request.headers.get("X-Admin-Token");
        
        if (adminToken !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        
        const docIndex = documents.findIndex(d => d.id === id);
        if (docIndex === -1) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        documents.splice(docIndex, 1);
        return NextResponse.json({ success: true, message: "Document deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}