import { supabase } from "../supabaseClient";

export const uploadImage = async (
  file: File | undefined
): Promise<{ filePath: string; fileName: string } | null> => {
  if (!file) {
    console.error("No file provided for upload.");
    return null;
  }

  const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
  const fileExt = file.name.split(".").pop()?.toLowerCase();

  if (!fileExt || !validExtensions.includes(fileExt)) {
    console.error("Invalid file type. Only images are allowed.");
    return null;
  }

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileName = `${timestamp}_${randomString}.${fileExt}`;
  const filePath = `public/${fileName}`;

  try {
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }

    return { filePath, fileName };
  } catch (e) {
    console.error("Unexpected error during upload:", e);
    return null;
  }
};
