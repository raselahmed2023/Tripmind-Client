// This page is intentionally minimal.
// The actual homepage is served by app/(public)/page.tsx via the (public) route group.
// Next.js route groups do not add URL segments, so (public)/page.tsx serves at /.
// This root page.tsx is required by Next.js but should not contain content.
export default function Page() {
  return null;
}
