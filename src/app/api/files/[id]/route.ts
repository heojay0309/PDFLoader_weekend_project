import { NextResponse } from "next/server";
import prisma from "@/utils/prisma/prisma";
import { supabase } from "@/utils/supabase/client";

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

    // New code to delete the file from Supabase storage
    const { error: storageError } = await supabase.storage
      .from("pdf-files") // Replace with your bucket name
      .remove([`pdfs/${file?.id}`]); // Adjust the path as necessary

    if (storageError) {
      throw new Error(storageError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
