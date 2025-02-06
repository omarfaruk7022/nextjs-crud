import { NextResponse } from "next/server";
import { deleteFile } from "@/app/lib/file";

export async function DELETE(request, { params }) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const success = await deleteFile(filename);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
