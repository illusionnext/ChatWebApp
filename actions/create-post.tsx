"use server";

import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface PostFormState {
  message: string | null;
  errors: Record<string, string>;
}

export default async function createPost(
  prevState: PostFormState | null,
  formData: FormData,
): Promise<PostFormState> {
  const errors: Record<string, string> = {};
  const image = formData.get("image");
  let processedImage: string | File;

  if (image instanceof File) {
    processedImage = image; // Keep the image as File if it's a valid File object
  } else {
    processedImage = ""; // Default to empty or a placeholder if no image is selected
  }

  const postData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    imageUrl: typeof processedImage === "string" ? processedImage : "", // Ensure image is a string
    userId: 1,
  };
  console.log(postData);

  // **Validate inputs**
  if (!postData.title) errors.title = "Title is required.";
  if (!postData.content) errors.content = "Content is required.";

  // **Return errors if validation fails**
  if (Object.keys(errors).length > 0) {
    return {
      message: "Validation failed. Please fix the errors above.",
      errors,
    };
  }

  // **No errors: Proceed to save data**
  try {
    await storePost(postData);
    console.dir('Revalidating "/feed" path... 💥🦈');
    revalidatePath("/feed", "layout");
  } catch (error) {
    console.error("Error adding a post: ❌🥊", error);
    return {
      message: "An error occurred while adding a post. Please try again.",
      errors: {},
    };
  }
  console.dir("Redirecting to feed page... 💥🦈");
  return redirect("/feed");
}
