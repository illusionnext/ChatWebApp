import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function NewPostPage() {
  // It is called Server Action
  async function createPost(formData: FormData) {
    "use server";
    const title = formData.get("title");
    const image = formData.get("image");
    const content = formData.get("content");
    console.log({ title, image, content });

    await storePost({
      imageUrl: "",
      title: title as string,
      content: content as string,
      userId: 1,
    });

    revalidatePath("/feed", "layout");

    return redirect("/feed");
  }

  return (
    <>
      <h1>Create a new post</h1>
      <form action={createPost}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Add your title"
          />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            required
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            placeholder="Add your content here 💥🥊"
          />
        </p>
        <p className="form-actions">
          <button type="reset">Reset</button>
          <button>Create Post</button>
        </p>
      </form>
    </>
  );
}
