import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDb from "@/lib/connectDb";
import Event from "@/models/event";
import { adminPermissions } from "@/lib/permissions";

export async function GET() {
  try {
    await connectDb();
    const events = await Event.find({});

    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка на сервере" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    await connectDb();
    const event = new Event(data);

    const savedevent = await event.save();

    return NextResponse.json({ data: savedevent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message.split(":")[2].trimStart().split(",")[0] },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await adminPermissions();
  const now = new Date();

  try {
    await connectDb();
    await Event.deleteMany({ end: { $lte: now } });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
