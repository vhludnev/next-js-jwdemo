import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/user";
import ForgotPass from "@/models/forgotpass";
import { createToken } from "@/lib/token";
import { sendMail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Ошибка! Проверьте адрес эл. почты." },
      { status: 422 }
    );
  }

  await connectDb();

  const existingUser = await User.findOne({
    email: { $regex: new RegExp("^" + email.toLowerCase(), "i") },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "Данный адрес эл. почты не прошёл регистрацию!" },
      { status: 422 }
    );
  }

  if (existingUser.provider === "google") {
    return NextResponse.json(
      { error: "Авторизируйтесь через Гугл." },
      { status: 422 }
    );
  }

  try {
    // const user_token = jwt.sign(
    //   {
    //     userId: existingUser.id,
    //   },
    //   process.env.RESET_TOKEN_SECRET,
    //   {
    //     expiresIn: '1h',
    //   }
    // )
    const user_token = createToken({ userId: existingUser.id });

    const newForgotPass = new ForgotPass({
      email,
      token: user_token,
    });

    const savedForgotPass = await newForgotPass.save();

    const resetString = `${process.env.BASE_URL}/auth/reset-password/${user_token}`;

    if (savedForgotPass) {
      const emailToSend = await sendMail(email, resetString);

      if (emailToSend) {
        return NextResponse.json({ data: "Success!" }, { status: 201 });
      }
      return NextResponse.json({ error: "Ошибка!" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Что-то пошло не так!" },
      { status: 500 }
    );
  }
}
