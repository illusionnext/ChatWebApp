"use client";
import { useActionState } from "react";
import PostForm from "@/components/SSG/post-form";
import createPost from "@/actions/create-post";

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(createPost, {
    message: null,
    errors: {}, // Ensure errors is always initialized
  });
  return (
    <PostForm
      message={state.message}
      errors={state.errors}
      formAction={formAction}
      isPending={isPending}
    />
  );
}
