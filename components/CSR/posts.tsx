"use client";
import { useOptimistic } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import LikeButton from "../SSG/like-icon";
import { PostTypes } from "@/types/post";
import { togglePostLikeStatus } from "@/actions/create-post";

type ActionType = (postId: number) => Promise<void>;

function imageLoader(config: { src: string; quality?: number }) {
  const urlStart = config.src.split("upload/")[0],
    urlEnd = config.src.split("upload/")[1],
    transformation = `w_300${config.quality ? `,q_${config.quality}` : 50}`; //removed h_200 to keep original aspect ratio

  console.dir(config);
  return `${urlStart}upload/${transformation}/${urlEnd}`;
}

function Post({ post, action }: { post: PostTypes; action: ActionType }) {
  return (
    <article className="post">
      <div className="post-image">
        <Image
          loader={imageLoader}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={post.imageUrl}
          alt={post.title}
          placeholder="empty"
          quality={100}
          width={600} // Define a maximum width for the image
          height={400} // Maintain aspect ratio or adjust as needed
          style={{
            maxWidth: "100%", // Ensure the image is responsive
            height: "auto", // Adjust height to preserve the aspect ratio
          }}
        />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              // action={togglePostLikeStatus.bind(null, post.id)} // Bind postId here
              action={action.bind(null, post.id)} // Bind postId here
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }: { posts: PostTypes[] }) {
  // const [ optimisticState, addOptimistic ] = useOptimistic( initialData, updateFunction )
  // ⚠️function inside of the useOptimistic() will change posts array on the client side, until the change has been processed on the server side
  // ⚠️optimisticPosts will be updated with the new value of posts
  // ⚠️updateOptimisticPosts() will be called with the new value of posts
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId) => {
      // Find the index of the post that was updated
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId,
      );
      // If the post was not found, return the previous posts
      if (updatedPostIndex === -1) return prevPosts;

      // Create a new array with the updated post
      const updatedPost = { ...prevPosts[updatedPostIndex] };
      // Update the likes count and the isLiked status
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      // Toggle the isLiked status
      updatedPost.isLiked = !updatedPost.isLiked;

      // Create a new array with the updated post
      const newPosts = [...prevPosts];
      // Replace the old post with the updated post
      newPosts[updatedPostIndex] = updatedPost;

      return newPosts;
    },
  );

  // ⚠️We are going to use optimisticPosts instead of posts in the return statement 👇

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(postId: number) {
    // "use server";
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
