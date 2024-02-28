import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Event from "@/models/event";
import type { NextRequest } from "next/server";
import { TEvent, TEventNew } from "@/types/event";

export async function GET(
  _req: NextRequest,
  route: { params: { eventId: string } }
) {
  const id = route.params.eventId;

  try {
    await connectDb();
    const event = await Event.findById(id);

    return NextResponse.json({ data: event }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Не найден!" }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  route: { params: { eventId: string } }
) {
  const id = route.params.eventId;

  const body: TEventNew = await req.json();

  try {
    await connectDb();
    const updatedevent = await Event.findByIdAndUpdate(
      id,
      { ...body },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    return NextResponse.json({ data: updatedevent }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message.split(":")[2].trimStart().split(",")[0] },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  route: { params: { eventId: string } }
) {
  const id = route.params.eventId;
  const { title, name1, name2, resourceId }: TEvent = await req.json();

  try {
    await connectDb();
    // Find the existing event by ID
    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return NextResponse.json({ error: "Не найден!" }, { status: 404 });
    }

    // Update the event with new data
    existingEvent.title = title;
    existingEvent.name1 = name1;
    existingEvent.name2 = name2;
    existingEvent.resourceId = resourceId;

    await existingEvent.save();

    return NextResponse.json({ data: existingEvent }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message.split(":")[2].trimStart().split(",")[0] },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  route: { params: { eventId: string } }
) {
  const id = route.params.eventId;

  try {
    await connectDb();
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
