import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import { verifyToken } from "@/lib/token";
import { hashPassword } from "@/lib/auth";
import User from "@/models/user";
import ForgotPass from "@/models/forgotpass";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 });
  }

  try {
    const id = await verifyToken(token);

    await connectDb();
    const tokenExists = await ForgotPass.findOne({ token });

    if (!id || !tokenExists) {
      return NextResponse.json(
        { error: "Неверная ссылка или её срок действия истёк" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: "Token valid" },
      { status: 201 /* , headers: { 'x-token': token } */ }
    );
    //const existingUser = await User.findOne({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') } })

    // some logic

    // return NextResponse.redirect(
    //     new URL(
    //       `/login?${new URLSearchParams({
    //         error: "badauth",
    //         forceLogin: "true",
    //       })}`,
    //       req.url
    //     )
    //   );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка! Попробуйте попозже." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  const { password } = await req.json();

  if (
    /* !email || !email.includes('@') || */ /* !token || */ !password ||
    password.trim().length < 7
  ) {
    return NextResponse.json(
      { error: "Ошибка! Длинна пароля не может быть менее 7." },
      { status: 422 }
    );
  }

  if (!token) {
    return NextResponse.json({ error: "Ошибка" }, { status: 400 });
  }

  const id = await verifyToken(token);

  try {
    if (id) {
      await connectDb();
      const existingUser = await User.findById(id);

      if (existingUser) {
        if (existingUser.provider === "google") {
          return NextResponse.json(
            { error: "Авторизируйтесь через Гугл." },
            { status: 422 }
          );
        }

        const hashedPassword = await hashPassword(password);

        existingUser.password = hashedPassword;

        await existingUser.save();
        await ForgotPass.findOneAndDelete({ email: existingUser.email });

        return NextResponse.json({ data: "Success" }, { status: 201 });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Ошибка! Попробуйте попозже." },
      { status: 500 }
    );
  }
}
