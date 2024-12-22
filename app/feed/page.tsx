import Posts from "@/components/CSR/posts";
import { getPosts } from "@/lib/posts";
import { use } from "react";

export default function FeedPage() {
  const posts = use(getPosts()); // No argument required
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
