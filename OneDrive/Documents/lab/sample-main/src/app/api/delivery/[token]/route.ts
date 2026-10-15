import { NextResponse } from "next/server";
import fs from "fs";
import { getOrderByDownloadToken, incrementDownloadCount } from "@/lib/orders";
import { getProductBySlug } from "@/lib/products";
import { resolveVaultFile } from "@/lib/delivery";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || typeof token !== "string") {
      return new NextResponse("Invalid download token parameter.", { status: 400 });
    }

    // 1. Verify token belongs to a verified order
    const order = await getOrderByDownloadToken(token);
    if (!order) {
      return new NextResponse(
        "Unauthorized: Access token not found or expired. Please look up your order at /orders.",
        { status: 403 }
      );
    }

    // 2. Strict status check: only verified / fulfilled orders can access file
    if (order.status !== "PAID" && order.status !== "DELIVERED") {
      return new NextResponse(
        "Payment Pending: Your order has not yet been verified by the administrator.",
        { status: 402 }
      );
    }

    // 3. Resolve digital product file from secure vault (outside public) or cloud blob
    const product = await getProductBySlug(order.productSlug);
    const fileRef = product?.fileReference || `${order.productSlug}.pdf`;

    // If fileReference is a cloud Blob URL, fetch or stream it securely
    if (fileRef.startsWith("http://") || fileRef.startsWith("https://")) {
      await incrementDownloadCount(order.id);
      const res = await fetch(fileRef);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `${order.productSlug}.pdf`;
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": res.headers.get("content-type") || "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "X-Delivery-Order-Id": order.id,
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }
    }

    const vault = resolveVaultFile(fileRef);

    if (!vault.exists) {
      // Fallback: If vault file not present, generate on-the-fly digital guide
      const fallbackContent = `# =================================================================
# ${order.productTitle.toUpperCase()}
# Official Digital Edition • Verified Customer Copy
# Author: Anubhav Bharti (vedxlabs)
# License: Single-User Personal License (${order.customerEmail})
# Order Reference: ${order.id}
# =================================================================

Welcome to ${order.productTitle}!

Thank you for your purchase. This handbook is your structured blueprint 
to go from complete zero to daily confidence with modern AI tools.

1. NOTION WORKSPACE ACCESS:
-> Access URL: https://notion.so/vedxlabs/${order.productSlug}-hub
-> Action: Duplicate to your personal workspace.

2. CONTACT & ASSISTANCE:
-> Email: contact@anubhavbharti.dev
-> DM: @vedxlabs (Instagram / Twitter)
`;
      await incrementDownloadCount(order.id);

      return new NextResponse(fallbackContent, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${order.productSlug}-guide-2026.md"`,
          "X-Delivery-Order-Id": order.id,
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // 4. Increment download metrics
    await incrementDownloadCount(order.id);

    // 5. Stream or read vault file safely
    const fileBuffer = fs.readFileSync(vault.filePath);

    // Determine MIME type
    let contentType = "application/octet-stream";
    if (vault.filename.endsWith(".pdf")) contentType = "application/pdf";
    else if (vault.filename.endsWith(".zip")) contentType = "application/zip";
    else if (vault.filename.endsWith(".md")) contentType = "text/markdown; charset=utf-8";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${vault.filename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "X-Delivery-Order-Id": order.id,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: unknown) {
    console.error("[DELIVERY_STREAM] Delivery error:", error);
    return new NextResponse("Internal server error during file delivery.", {
      status: 500,
    });
  }
}
