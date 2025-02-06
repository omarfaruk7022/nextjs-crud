import { unlink } from "fs/promises";
import path from "path";

export async function deleteFile(filename) {
  try {
    // Extract filename from full URL if needed
    const parsedFilename = path.basename(filename);
    const filepath = path.join(process.cwd(), "public/uploads", parsedFilename);

    await unlink(filepath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
