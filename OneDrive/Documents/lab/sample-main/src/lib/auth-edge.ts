export const ADMIN_COOKIE_NAME = "vedx_admin_token";

/**
 * Validates token structure for edge middleware.
 * Full cryptographic verification is executed in node server runtimes (layout & api routes).
 */
export function isEdgeAdminAuthenticated(cookieHeader?: string | null): boolean {
  if (!cookieHeader) return false;
  // Match vedx_admin_token=vdx_*
  const match = cookieHeader.match(/vedx_admin_token=vdx_[A-Za-z0-9_]+/);
  return Boolean(match);
}
