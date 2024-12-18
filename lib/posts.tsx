"use server";
import sql from "better-sqlite3";
import { Like, Post, PostInput } from "@/types/post";

const db = new sql("posts.db");

function initDb() {
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
                                             id INTEGER PRIMARY KEY,
                                             first_name TEXT,
                                             last_name TEXT,
                                             email TEXT
        )`);
  db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
                                             id INTEGER PRIMARY KEY,
                                             image_url TEXT NOT NULL,
                                             title TEXT NOT NULL,
                                             content TEXT NOT NULL,
                                             created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                                             user_id INTEGER,
                                             FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);
  db.exec(`
        CREATE TABLE IF NOT EXISTS likes (
                                             user_id INTEGER,
                                             post_id INTEGER,
                                             PRIMARY KEY(user_id, post_id),
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
            )`);

  const stmt = db.prepare("SELECT COUNT(*) AS count FROM users");
  if (stmt.get().count === 0) {
    db.exec(`
            INSERT INTO users (first_name, last_name, email)
            VALUES ('John', 'Doe', 'john@example.com')`);

    db.exec(`
            INSERT INTO users (first_name, last_name, email)
            VALUES ('Max', 'Schwarz', 'max@example.com')`);
  }
}

initDb();

export async function getPosts(maxNumber?: number): Promise<Post[]> {
  const limitClause = maxNumber ? "LIMIT ?" : "";
  const stmt = db.prepare(`
        SELECT posts.id, image_url AS imageUrl, title, content, created_at AS createdAt,
               first_name AS userFirstName, last_name AS userLastName,
               COUNT(likes.post_id) AS likes,
               EXISTS(
                   SELECT * FROM likes
                   WHERE likes.post_id = posts.id AND likes.user_id = 2
               ) AS isLiked
        FROM posts
                 INNER JOIN users ON posts.user_id = users.id
                 LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id
        ORDER BY createdAt DESC
            ${limitClause}`);

  const results = maxNumber ? stmt.all(maxNumber) : stmt.all();

  return (results as any[]).map((result) => ({
    id: result.id,
    imageUrl: result.imageUrl,
    title: result.title,
    content: result.content,
    createdAt: result.createdAt,
    userFirstName: result.userFirstName,
    userLastName: result.userLastName,
    likes: result.likes,
    isLiked: result.isLiked,
  }));
}

export async function storePost(post: PostInput) {
  const stmt = db.prepare(`
        INSERT INTO posts (image_url, title, content, user_id)
        VALUES (?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}

export async function updatePostLikeStatus(postId: number, userId: number) {
  const stmt = db.prepare(`
        SELECT COUNT(*) AS count
        FROM likes
        WHERE user_id = ? AND post_id = ?`);
  const isLiked = stmt.get(userId, postId).count === 0;

  if (isLiked) {
    const insertStmt = db.prepare(`
            INSERT INTO likes (user_id, post_id)
            VALUES (?, ?)`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return insertStmt.run(userId, postId);
  } else {
    const deleteStmt = db.prepare(`
            DELETE FROM likes
            WHERE user_id = ? AND post_id = ?`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return deleteStmt.run(userId, postId);
  }
}
