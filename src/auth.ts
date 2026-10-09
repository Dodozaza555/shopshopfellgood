import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId =
  process.env.AUTH_GOOGLE_ID ??
  process.env.GOOGLE_CLIENT_ID ??
  process.env.GOOGLE_ID ??
  "";
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ??
  process.env.GOOGLE_CLIENT_SECRET ??
  process.env.GOOGLE_SECRET ??
  "";

const googleProvider =
  googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: googleProvider ? [googleProvider] : [],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }

      return true;
    },
  },
});
