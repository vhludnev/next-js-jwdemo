export type TUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  password: string;
  provider: "google" | "credentials";
  image: string;
  status: "admin" | "user";
  verified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type TUserResponse = Pick<TUser, "email" | "name" | "password">;
export type TUserNew = TUserResponse & { username: string };

export type TAccess = "publisher" | "admin";
