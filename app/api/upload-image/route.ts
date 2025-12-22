import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { file } = await req.json(); // Base64 image

    const upload = await cloudinary.uploader.upload(file, {
      folder: "courses",
    });

    return NextResponse.json({ url: upload.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
