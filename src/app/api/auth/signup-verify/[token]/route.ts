import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import { verifyEmailToken } from "@/lib/token";
import { hashPassword } from "@/lib/auth";
import User from "@/models/user";
import { TUserNew, TUserResponse } from "@/types/user";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 });
  }

  try {
    const data: TUserResponse | null = await verifyEmailToken(token);

    if (!data) {
      return NextResponse.json(
        { error: "Неверная ссылка или её срок действия истёк" },
        { status: 422 }
      );
    }

    try {
      const { name, email, password } = data;

      const hashedPassword = await hashPassword(password);
      const username = email.split("@")[0].toLowerCase();

      await connectDb();

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        username:
          username.length > 6
            ? username
            : `${username}${Math.floor(Math.random() * (10000 - 1000) + 1000)}`,
      } as TUserNew);

      await newUser.save();

      return NextResponse.json({ data: "Success!" }, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: "Неверная ссылка либо адрес эл. почты уже был подтверждён!" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка! Попробуйте попозже." },
      { status: 500 }
    );
  }
}
