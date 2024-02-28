import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import { adminPermissions } from "@/lib/permissions";
import User from "@/models/user";
import { nameIsValid, emailIsValid } from "@/utils";

export async function PATCH(req: NextRequest) {
  await adminPermissions();

  const id = req.nextUrl.searchParams.get("userId");

  const { status, name, email, provider, verified } = await req.json();

  try {
    await connectDb();
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ error: "Не найден!" }, { status: 404 });
    }

    // 1. Update user with new data - status
    if (status) {
      existingUser.status = status;
    } else if (name) {
      // 2a. Update user with new data - name
      if (!nameIsValid(name)) {
        return NextResponse.json(
          { error: "Имя указано неверно" },
          { status: 500 }
        );
      }
      existingUser.name = name;
    } else if (email) {
      // 2b. Update user with new data - email
      if (!emailIsValid(email)) {
        return NextResponse.json(
          { error: "Адрес эл. почты указан неверно" },
          { status: 500 }
        );
      }
      if (
        email.split("@")[1] !== "gmail.com" &&
        existingUser.provider === "google"
      ) {
        existingUser.provider = "credentials";
      }
      existingUser.email = email;
    } else if (provider) {
      existingUser.provider = provider;
    } else if (verified) {
      existingUser.verified = verified;
    }

    const result = await existingUser.save();

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    if (name) {
      return NextResponse.json(
        {
          error: "Ошибка! Пользователь с этим именем уже был зарегистрирован.",
        },
        { status: 400 }
      );
    }
    if (email) {
      return NextResponse.json(
        {
          error:
            "Ошибка! Пользователь с этим адресом эл. почты уже был зарегистрирован.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message.split(":")[2].trimStart().split(",")[0] },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await adminPermissions();

  const id = req.nextUrl.searchParams.get("userId");

  //   if (id === '647eeac8f8a40d2287bb2e2f') {
  //     return NextResponse.json({ error: 'В доступе отказано', status: 403 })
  //   }

  try {
    await connectDb();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
