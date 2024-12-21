"use server";
import "server-only";
import sql from "better-sqlite3";
// import slugify from "slugify";
import xss from "xss";
import { Like, Post, PostInput } from "@/types/post";
import Database from "better-sqlite3";

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
                                             imageUrl TEXT NOT NULL,
                                             title TEXT NOT NULL,
                                             content TEXT NOT NULL,
                                             created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                                             userId INTEGER,
                                             FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
            )`);
  db.exec(`
        CREATE TABLE IF NOT EXISTS likes (
                                             userId INTEGER,
                                             postId INTEGER,
                                             PRIMARY KEY(userId, postId),
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
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
        SELECT posts.id, imageUrl AS imageUrl, title, content, created_at AS createdAt,
               first_name AS userFirstName, last_name AS userLastName,
               COUNT(likes.postId) AS likes,
               EXISTS(
                   SELECT * FROM likes
                   WHERE likes.postId = posts.id AND likes.userId = 2
               ) AS isLiked
        FROM posts
                 INNER JOIN users ON posts.userId = users.id
                 LEFT JOIN likes ON posts.id = likes.postId
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

export async function storePost({
  imageUrl,
  title,
  content,
  userId,
}: PostInput): Promise<Database.RunResult> {
  const stmt = db.prepare(`
INSERT INTO posts (imageUrl, title, content, userId)
VALUES (?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(imageUrl, title, content, userId);
}

export async function updatePostLikeStatus(postId: number, userId: number) {
  const stmt = db.prepare(`
        SELECT COUNT(*) AS count
        FROM likes
        WHERE userId = ? AND postId = ?`);
  const isLiked = stmt.get(userId, postId).count === 0;

  if (isLiked) {
    const insertStmt = db.prepare(`
            INSERT INTO likes (userId, postId)
            VALUES (?, ?)`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return insertStmt.run(userId, postId);
  } else {
    const deleteStmt = db.prepare(`
            DELETE FROM likes
            WHERE userId = ? AND postId = ?`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return deleteStmt.run(userId, postId);
  }
}
