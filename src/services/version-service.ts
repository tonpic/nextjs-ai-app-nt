import type { ApiVersion } from "@/types/version";

export async function getVersion(): Promise<ApiVersion> {
  const response = await fetch('https://api.codingthailand.com/api/version');
  if (!response.ok) {
    throw new Error(`Failed to fetch version: ${response.status}`);
  }
  const data = await response.json();
  return data.data as ApiVersion;
}
