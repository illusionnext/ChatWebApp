import Posts from "@/components/CSR/posts";
import { getPosts } from "@/lib/posts";
import { use } from "react";

// we can create generic metadata by using params, slug, or query
export async function generateMetadata() {
  const post = await getPosts(),
    numberOfPosts = post.length;
  return {
    title: `Browse All ${numberOfPosts} Posts`,
    description: `Browse all ${numberOfPosts} posts from the community`,
  };
}

export default function FeedPage() {
  const posts = use(getPosts()); // No argument required
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
