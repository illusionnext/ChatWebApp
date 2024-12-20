// import FormStatus from "@/components/CSR/form-status";

interface PostFormProps {
  message: string | null;
  errors: Record<string, string>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

export default function PostForm({
  message,
  errors,
  formAction,
  isPending,
}: PostFormProps) {
  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="Add your title 💥🦈 #jinx"
          />
          {errors.title && <span className="form-errors">{errors.name}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="image">Image 🖼️</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            required
          />
          {message && <span className="form-errors">{message}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            placeholder="Add your content here 🧸💣💥 #powder"
          />
          {errors.content && <span className="form-errors">{errors.name}</span>}
        </p>
        {isPending ? (
          <p className="form-actions"> Submitting...</p>
        ) : (
          <p className="form-actions">
            <button type="reset">Reset</button>
            <button>Create Post</button>
          </p>
        )}
      </form>
    </>
  );
}
