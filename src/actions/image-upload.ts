"use server";

import { imagekit } from "@/lib/imagekit";


export const uploadImage = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: buffer,
        fileName: file.name,
        folder: "/posts",
      },
      (error, result) => {
        if (error) {
          reject({ success: false, error: error.message });
        } else {
          resolve({ success: true, url: result?.url });
        }
      }
    );
  });
};
