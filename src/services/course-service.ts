import type { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch('https://api.codingthailand.com/api/course');
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }
  const data = await response.json();
  return data.data as Course[];
}
