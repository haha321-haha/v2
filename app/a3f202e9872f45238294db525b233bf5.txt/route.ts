import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("a3f202e9872f45238294db525b233bf5", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
