"use server";

import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import uploadImageFile from "@/lib/cloudinary";

interface PostFormState {
  message: string | null;
  errors: Record<string, string>;
}

export default async function createPost(
  prevState: PostFormState | null,
  formData: FormData,
): Promise<PostFormState> {
  const errors: Record<string, string> = {};
  const image = formData.get("image") as File;
  let processedImage: string = "";

  if (image instanceof File) {
    try {
      processedImage = await uploadImageFile(image); // Upload the image and get the URL
    } catch (error) {
      console.error("Error uploading image: ❌🥊", error);
      return {
        message:
          "An error occurred while uploading the image. Please try again.",
        errors: {},
      };
    }
  }

  const postData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    imageUrl: processedImage,
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

// This function is used to toggle the like status of a post.
export async function togglePostLikeStatus(postId: number) {
  await updatePostLikeStatus(postId, 2); //it needs postId and userId, We are hardcoding userId to 2.Later time I will create Login and get userId from there.
  revalidatePath("/feed", "page");
}
