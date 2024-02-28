import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import { createToken } from "@/lib/token";
import { sendVerifyEmail } from "@/lib/sendEmail";
import { nameIsValid } from "@/utils";
import { BLACKLIST_EMAILS } from "@/constants";
import { TUserResponse } from "@/types/user";

export async function POST(req: NextRequest) {
  const { name, email, password }: TUserResponse = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Ошибка! Проверьте адрес эл. почты." },
      { status: 422 }
    );
  }

  if (password && password.trim().length < 7) {
    return NextResponse.json(
      { error: "Ошибка! Длинна пароля не может быть менее 7." },
      { status: 422 }
    );
  }

  if (!nameIsValid(name)) {
    return NextResponse.json({ error: "Имя указано неверно" }, { status: 422 });
  }

  if (BLACKLIST_EMAILS.includes(email.toLowerCase())) {
    return NextResponse.json(
      { error: "Вы уже зарегистрированны через другой адрес эл.почты!" },
      { status: 422 }
    );
  }

  await connectDb();

  const existingUser = await User.findOne({
    email: { $regex: new RegExp("^" + email.toLowerCase(), "i") },
  });

  if (existingUser?.provider === "credentials") {
    return NextResponse.json(
      { error: "Этот адрес эл. почты уже зарегистрирован!" },
      { status: 422 }
    );
  }

  if (existingUser?.provider === "google") {
    return NextResponse.json(
      { error: "Авторизируйтесь через Гугл." },
      { status: 422 }
    );
  }

  try {
    const user_token = createToken({ name, email, password });

    const resetString = `${process.env.BASE_URL}/auth/verify/${user_token}`;

    const emailToSend = await sendVerifyEmail(email, resetString);

    if (emailToSend) {
      return NextResponse.json({ data: "Success!" }, { status: 201 });
    }
    return NextResponse.json({ error: "Ошибка!" }, { status: 500 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Что-то пошло не так!" },
      { status: 500 }
    );
  }
}
