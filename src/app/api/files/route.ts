import { NextResponse } from "next/server";

import prisma from "@/utils/prisma/prisma";

import { supabase } from "@/utils/supabase/client";

export async function GET() {
  try {
    const files = await prisma.uploadedFile.findMany({
      include: {
        fileAudio: true,
      },
    });

    const filesWithStatus = await Promise.all(
      files.map(async (file) => {
        if (file.fileAudio.status.toLowerCase() === "in_progress") {
          const statusResponse = await fetch(
            `https://api.play.ai/api/v1/tts/${file.fileAudio.id}`,
            {
              headers: {
                AUTHORIZATION: `Bearer ${process.env.PLAYAI_API_KEY}`,
                "X-User-ID": process.env.PLAYAI_USER_ID || "",
              },
            },
          );
          const data = await statusResponse.json();

          if (data.output.status.toLowerCase() !== "in_progress") {
            const updatedFileAudio = await prisma.fileAudio.update({
              where: { id: file.fileAudio.id },
              data: {
                status: data.output.status,
                url: data.output.url,
              },
            });
            return {
              ...file,
              status: updatedFileAudio.status,
              url: updatedFileAudio.url,
              isLoading: false,
            };
          }
        } else {
          return { ...file, isLoading: false };
        }
      }),
    );

    return NextResponse.json(filesWithStatus);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const texts = formData.getAll("text");

    const savedFiles = await Promise.all(
      files.map(async (file: any, index: number) => {
        // Check if file already exists in the uploadedFile table
        const existingFile = await prisma.uploadedFile.findFirst({
          where: { name: (file as File).name as string },
        });

        if (existingFile) {
          console.log(`File with name ${file.name} already exists.`);
          return existingFile;
        }

        const text = texts[index];

        // then convert the text to speech
        const ttsResponse = await convertTextToSpeech(text as string);
        if (!ttsResponse) {
          return NextResponse.json(
            { error: `Unable to process TTS for file: ${file.name}` },
            { status: 400 },
          );
        }

        const filePath = `pdfs/${ttsResponse.id}`;
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("pdf-files")
          .upload(filePath, file);

        if (error) {
          console.log("error", error);
          return error;
        }

        // then create the file audio
        const fileAudio = await prisma.fileAudio.create({
          data: {
            id: ttsResponse.id,
            url: ttsResponse.output.url || "",
            status: ttsResponse.output.status,
          },
        });

        // Get Public URL
        const { data: publicUrl } = supabase.storage
          .from("pdf-files")
          .getPublicUrl(filePath);

        return await prisma.uploadedFile.create({
          data: {
            name: (file as File).name,
            url: publicUrl.publicUrl || "",
            fileAudioId: fileAudio.id,
          },
          include: {
            fileAudio: true,
          },
        });
      }),
    );

    return NextResponse.json(savedFiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 },
    );
  }
}

const convertTextToSpeech = async (text: string): Promise<any> => {
  try {
    const payload = {
      model: "PlayDialog",
      text: text,
      voice:
        "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json",
    };

    const response = await fetch("https://api.play.ai/api/v1/tts", {
      method: "POST",
      headers: {
        AUTHORIZATION: `Bearer ${process.env.PLAYAI_API_KEY}`,
        "Content-Type": "application/json",
        "X-User-ID": process.env.PLAYAI_USER_ID || "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.log("response", response);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
