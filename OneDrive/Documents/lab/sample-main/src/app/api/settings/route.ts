import { NextResponse } from "next/server";
import { getPlatformSettings, updatePlatformSettings } from "@/lib/settings";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getPlatformSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch settings";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await isServerAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = await updatePlatformSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
