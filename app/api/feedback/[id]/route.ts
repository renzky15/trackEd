import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type RouteParams = { params: { id: string } };

// GET single feedback
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// PUT update feedback
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const feedback = await prisma.feedback.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title: body.title,
        content: body.content,
        rating: body.rating,
        category: body.category || null,
      },
    });

    return NextResponse.json(feedback);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

// DELETE feedback
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.feedback.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
