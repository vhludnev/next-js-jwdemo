import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import { hashPassword } from "@/lib/auth";
import User from "@/models/user";
import { nameIsValid } from "@/utils";
import { BLACKLIST_EMAILS } from "@/constants";
import { TUserResponse } from "@/types/user";

export async function POST(req: NextRequest) {
  const { name, email, password }: TUserResponse = await req.json();

  if (
    !email ||
    !email.includes("@") ||
    !name ||
    !password ||
    password.trim().length < 7
  ) {
    return NextResponse.json({
      error: "Ошибка! Длинна пароля не может быть менее 7.",
      status: 422,
    });
  }

  if (!nameIsValid(name)) {
    return NextResponse.json({ error: "Имя указано неверно", status: 422 });
  }

  if (BLACKLIST_EMAILS.includes(email.toLowerCase())) {
    return NextResponse.json({
      error: "Вы уже зарегистрированны через другой адрес эл.почты!",
      status: 422,
    });
  }

  await connectDb();

  /* checking if a user with this email has already been registered */
  //const existingUser = await User.findOne({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') } })
  const existingUser = await User.findOne({
    $or: [
      { email: { $regex: new RegExp("^" + email.toLowerCase(), "i") } },
      { name },
    ],
  });

  if (existingUser) {
    return NextResponse.json({
      error: "Пользователь уже зарегистрирован!",
      status: 422,
    });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const username = email.split("@")[0].toLowerCase();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username:
        username.length > 6
          ? username
          : `${username}${Math.floor(Math.random() * (10000 - 1000) + 1000)}`,
      verified: false,
    });

    await newUser.save();

    const { password: pass, ...otherUserData } = newUser;

    return NextResponse.json({ data: otherUserData, status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message.split(":")[2].trimStart().split(",")[0],
      status: 500,
    });
  }
}
