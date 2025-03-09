import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

// Valid categories
const VALID_CATEGORIES = [
  "Staff",
  "Facilities",
  "Extracurricular",
  "Resources",
  "Curriculum",
  "Policies",
  "Others",
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Helper function to get category for admin role
function getCategoryForAdminRole(role: string): string | null {
  const roleToCategory: Record<string, string> = {
    ADMIN_STAFF: "Staff",
    ADMIN_FACILITIES: "Facilities",
    ADMIN_EXTRACURRICULAR: "Extracurricular",
    ADMIN_RESOURCES: "Resources",
    ADMIN_CURRICULUM: "Curriculum",
    ADMIN_POLICIES: "Policies",
  };

  return roleToCategory[role] || null;
}

// GET all feedback
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = new URL(request.url).searchParams;
    const category = searchParams.get("category");

    // Base query
    let whereClause = {};

    // If user is not authenticated, return error
    if (!session?.user?.role) {
      return NextResponse.json(
        { error: "You must be signed in to view feedback" },
        { status: 401 }
      );
    }

    const userRole = session.user.role;

    // If user is a super admin or admin, show all feedback
    if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
      if (category) {
        whereClause = {
          category: category,
        };
      }
    }
    // If user is a category admin, only show their category's feedback
    else if (userRole.startsWith("ADMIN_")) {
      const adminCategory = getCategoryForAdminRole(userRole);
      if (adminCategory) {
        whereClause = {
          category: adminCategory,
        };
      }
    }
    // Regular users can only see their own feedback
    else {
      whereClause = {
        userId: session.user.id,
      };
    }

    const feedback = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: [
        {
          category: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Group feedback by category
    const groupedFeedback = feedback.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof feedback>);

    return NextResponse.json(groupedFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// POST new feedback
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to create feedback" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Received feedback data:", body);

    // Validate required fields
    if (!body.title || !body.content || typeof body.rating !== "number") {
      console.error("Missing required fields:", {
        title: !body.title,
        content: !body.content,
        rating: typeof body.rating !== "number",
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      console.error("Invalid rating value:", body.rating);
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate category
    if (
      body.category &&
      !VALID_CATEGORIES.includes(body.category as ValidCategory)
    ) {
      console.error("Invalid category:", body.category);
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const feedbackData: Prisma.FeedbackUncheckedCreateInput = {
      title: body.title.trim(),
      content: body.content.trim(),
      rating: body.rating,
      category: body.category?.trim() || null,
      status: "IN_PROGRESS",
      userId: session.user.id,
    };

    console.log("Creating feedback with data:", feedbackData);

    const feedback = await prisma.feedback.create({
      data: feedbackData,
    });

    console.log("Feedback created successfully:", feedback);
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create feedback", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
