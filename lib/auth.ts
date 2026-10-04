import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default_super_secret_jwt_key_at_least_32_bytes_long!!"
);

const COOKIE_NAME = "superrich_admin_session";

export async function createAdminSession(username: string) {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ADMIN_JWT_SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function verifyAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function validateAdminCredentials(user: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "admin123";
  return user === expectedUser && pass === expectedPass;
}
