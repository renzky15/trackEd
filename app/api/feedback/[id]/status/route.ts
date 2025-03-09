import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { Status } from "@prisma/client";
import { clients } from "../../status-updates/route";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;

    // Only allow admins to update status
    if (
      !userRole ||
      (!userRole.startsWith("ADMIN_") &&
        userRole !== "SUPER_ADMIN" &&
        userRole !== "ADMIN")
    ) {
      return NextResponse.json(
        { error: "Unauthorized to update status" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid feedback ID" },
        { status: 400 }
      );
    }

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !(status in Status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status value. Must be either 'IN_PROGRESS' or 'COMPLETED'",
        },
        { status: 400 }
      );
    }

    // If category admin, verify they can update this feedback
    if (userRole.startsWith("ADMIN_")) {
      const roleToCategory: Record<string, string> = {
        ADMIN_STAFF: "Staff",
        ADMIN_FACILITIES: "Facilities",
        ADMIN_EXTRACURRICULAR: "Extracurricular",
        ADMIN_RESOURCES: "Resources",
        ADMIN_CURRICULUM: "Curriculum",
        ADMIN_POLICIES: "Policies",
      };

      if (existingFeedback.category !== roleToCategory[userRole]) {
        return NextResponse.json(
          { error: "Unauthorized to update this feedback" },
          { status: 401 }
        );
      }
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status: status as Status,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    // Broadcast status update to all connected clients
    const updateMessage = {
      type: "status_update",
      feedbackId: id,
      status: updatedFeedback.status,
      updatedAt: updatedFeedback.updatedAt,
    };

    console.log("Broadcasting status update to clients:", updateMessage);
    console.log("Number of connected clients:", clients.size);

    // Send the update to all connected clients
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(
      `data: ${JSON.stringify(updateMessage)}\n\n`
    );

    for (const client of clients) {
      try {
        await client.writer.write(encodedMessage);
        console.log(`Status update sent to client: ${client.id}`);
      } catch (error) {
        console.error(`Failed to send update to client ${client.id}:`, error);
        clients.delete(client);
      }
    }

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      {
        error: "Failed to update status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
