import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { firestore } from "firebase-admin";

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const author = "TechFishe"
  const msg = formData.get("msg");

  if (!msg) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }
  try {
    const db = getFirestore(app);
    const chatsRef = db.collection("chats");
    await chatsRef.add({
      author: author,
      msg: msg,
      createdAt: firestore.Timestamp.now()
    });
  } catch (error) {
    return new Response(`Something went wrong ${error}`, {
      status: 500,
    });
  }
  return redirect("/chat");
};