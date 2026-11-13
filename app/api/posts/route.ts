import { NextResponse } from "next/server";
import { getAllPostsIncludingDrafts, getPostBySlug, savePost, deletePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";

// Valid admin tokens - local and Vercel
const VALID_TOKENS = [
    process.env.ADMIN_PASSWORD || "antigravity2024",
    "Yusto2025@", // Local admin password
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || ""
].filter(Boolean);

function isValidToken(token: string | null): boolean {
    if (!token) return false;
    return VALID_TOKENS.includes(token);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const token = request.headers.get("x-admin-token");

    if (!isValidToken(token)) {
        console.error(`[API] Unauthorized GET request. Token not in valid list.`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (slug) {
        const post = await getPostBySlug(slug);
        return NextResponse.json({ post });
    }

    const posts = await getAllPostsIncludingDrafts();
    return NextResponse.json({ posts });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const token = request.headers.get("x-admin-token");

        if (!isValidToken(token)) {
            console.error(`[API] Unauthorized POST request. Token not in valid list.`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const slug = body.slug;
        const content = body.content;
        
        const frontmatter = body.frontmatter || { ...body };
        if (frontmatter.content) delete (frontmatter as any).content;
        if (frontmatter.slug) delete (frontmatter as any).slug;

        await savePost(slug, frontmatter, content);

        try {
            revalidatePath("/");
            revalidatePath("/post/[slug]", "page");
            console.log(`[API] Revalidated paths for slug: ${slug}`);
        } catch (revErr) {
            console.error(`[API] Revalidation error (non-fatal):`, revErr);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`[API] POST error:`, error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const token = request.headers.get("x-admin-token");

    if (!isValidToken(token)) {
        console.error(`[API] Unauthorized DELETE request. Token not in valid list.`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (slug) {
        await deletePost(slug);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Slug required" }, { status: 400 });
}