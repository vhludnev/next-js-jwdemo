import NextAuth, { DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  provider?: string;
  verified?: boolean;
  status?: string;
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User & DefaultSession["user"];
  }
}
