import { NextResponse } from "next/server";
import prisma from "@/utils/prisma/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const file = await prisma.uploadedFile.findUnique({
      where: { id },
      include: {
        fileAudio: true,
      },
    });

    await prisma.uploadedFile.delete({
      where: { id },
    });

    await prisma.fileAudio.delete({
      where: { id: file?.fileAudio.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
