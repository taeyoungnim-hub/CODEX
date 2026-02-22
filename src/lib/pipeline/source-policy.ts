export function isDomainAllowed(domain: string): boolean {
  const allowlist = (process.env.ALLOWED_SOURCE_DOMAINS ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  if (allowlist.length === 0) return false;
  return allowlist.includes(domain);
}
