const SAFE_REDIRECT_PATHS = ["/login", "/register"] as const;

export function sanitizeRedirect(path: string | null): string {
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.startsWith("/\\")
  ) {
    return "/dashboard";
  }
  for (const safe of SAFE_REDIRECT_PATHS) {
    if (path === safe) return "/dashboard";
  }
  return path;
}
