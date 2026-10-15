import { NextResponse } from "next/server";
import {
  validateAdminCredentialsAsync,
  ADMIN_COOKIE_NAME,
  isServerAdminAuthenticated,
  isAdminSetupRequired,
  setAdminPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  generateAdminSessionToken,
  AUTHORIZED_ADMIN_EMAIL,
} from "@/lib/auth";

export async function GET() {
  const isAuth = await isServerAdminAuthenticated();
  const setupRequired = await isAdminSetupRequired();
  return NextResponse.json({
    authenticated: isAuth,
    setupRequired,
    adminEmail: AUTHORIZED_ADMIN_EMAIL,
  });
}

export async function POST(request: Request) {
  try {
    // Get client identifier for rate limiting (x-forwarded-for or default)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { limited, retryAfterSeconds } = checkRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, username, password, action, newPassword } = body;
    const providedEmail = (email || username || "").trim().toLowerCase();

    // First-run setup action: if no password configured, admin sets it directly
    if (action === "setup") {
      const isSetupNeeded = await isAdminSetupRequired();
      if (!isSetupNeeded) {
        return NextResponse.json(
          { success: false, error: "Admin credentials already configured." },
          { status: 400 }
        );
      }

      if (providedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        return NextResponse.json(
          {
            success: false,
            error: `Only the authorized administrator (${AUTHORIZED_ADMIN_EMAIL}) can perform setup.`,
          },
          { status: 403 }
        );
      }

      const passwordToSet = newPassword || password;
      if (!passwordToSet || passwordToSet.length < 8) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      await setAdminPassword(passwordToSet);
      clearRateLimit(ip);

      const sessionToken = generateAdminSessionToken();
      const response = NextResponse.json({
        success: true,
        message: "Admin password successfully created.",
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });

      return response;
    }

    // Normal Login Authentication
    const isValid = await validateAdminCredentialsAsync(providedEmail, password);

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Clear failed attempts upon successful login
    clearRateLimit(ip);

    const sessionToken = generateAdminSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
