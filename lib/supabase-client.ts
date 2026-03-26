"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP files are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Maximum file size is 2MB.");
  }
}

export async function uploadPublicImage(file: File, folder: "shop" | "projects") {
  validateImageFile(file);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}
