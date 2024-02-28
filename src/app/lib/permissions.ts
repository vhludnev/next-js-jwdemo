import { TAccess, TUser } from "../types/user";
import { getCurrentUser } from "./session";

export const publisherPermissions = async () => {
  const session = await getCurrentUser();

  if (session && !!session.user.group && !!session.user.name) {
    return true;
  }

  throw new Error("В доступе отказано");
};

export const adminPermissions = async () => {
  const session = await getCurrentUser();

  if (session && session.user.status === "admin") {
    return true;
  }

  throw new Error("В доступе отказано");
};

export const permission = (access: TAccess, user: TUser) => {
  if (!user) return false;
  switch (access) {
    case "publisher":
      return user.verified && !!user.name;
    case "admin":
      return ["admin"].includes(user.status);
    default:
      return false;
  }
};
