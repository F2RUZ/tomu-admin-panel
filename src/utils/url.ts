// src/utils/url.ts

const OLD_BACKEND_URL = "https://tomubackend.tomu.uz";
const NEW_BACKEND_URL = "http://213.136.64.206:7777";

export const getImageUrl = (
  imageUrl: string | null | undefined,
): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.includes("tomubackend.tomu.uz")) {
    return imageUrl.replace(OLD_BACKEND_URL, NEW_BACKEND_URL);
  }
  if (imageUrl.startsWith("http")) return imageUrl;
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? NEW_BACKEND_URL;
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://213.136.64.206:7777/api";
