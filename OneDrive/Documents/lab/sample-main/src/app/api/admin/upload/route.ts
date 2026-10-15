import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { put } from "@vercel/blob";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const isAuth = await isServerAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "images"; // "images" or "vault"

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique name
    const ext = path.extname(file.name).toLowerCase();
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    const uniqueFilename = `${base}_${Date.now()}${ext}`;

    // 1. If Vercel Blob is configured (via BLOB_READ_WRITE_TOKEN on Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const isVault = folder === "vault";
        const blobPathname = `${folder}/${uniqueFilename}`;
        const blob = await put(blobPathname, file, {
          access: isVault ? "private" : "public",
        });

        if (isVault) {
          return NextResponse.json({
            success: true,
            filename: uniqueFilename,
            fileReference: blob.url, // Store the blob URL as the fileReference
            size: buffer.length,
          });
        } else {
          return NextResponse.json({
            success: true,
            url: blob.url,
            filename: uniqueFilename,
          });
        }
      } catch (blobErr) {
        console.warn("[UPLOAD] Vercel Blob error, falling back to filesystem:", blobErr);
      }
    }

    // 2. Local Filesystem storage (for local dev and persistent server/Render)
    if (folder === "vault") {
      const targetDir = path.join(process.cwd(), "vault");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, uniqueFilename);
      fs.writeFileSync(targetPath, buffer);

      return NextResponse.json({
        success: true,
        filename: uniqueFilename,
        fileReference: uniqueFilename,
        size: buffer.length,
      });
    } else {
      const targetDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, uniqueFilename);
      fs.writeFileSync(targetPath, buffer);

      return NextResponse.json({
        success: true,
        url: `/images/${uniqueFilename}`,
        filename: uniqueFilename,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload file";
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
