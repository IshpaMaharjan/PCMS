// src/pages/Feed.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // Trash icon

const Feed = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user and token
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const userRole = user?.role;
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* =========================
     LOAD POSTS
  ========================= */
  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        setPosts(res.data);
      } catch (error) {
        if (error.name !== "CanceledError") console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
    return () => controller.abort();
  }, [token]);

  /* =========================
     HANDLE POST CREATION
     (only for user/professional)
  ========================= */
  const handlePost = async () => {
    if (!content.trim()) return alert("Write something!");

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post(`${baseUrl}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      setPreview(null);

      // Refresh posts
      const res = await axios.get(`${baseUrl}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    }
  };

  /* =========================
     HANDLE DELETE POST
  ========================= */
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${baseUrl}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete post");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!user) return <p className="text-center mt-8">Access denied</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* =========================
            POST CREATION (only for user/professional)
        ========================= */}
        {userRole !== "admin" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Share Your Achievement 🎉</h2>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your achievement..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 rounded-xl max-h-64 object-cover"
              />
            )}

            <div className="flex justify-between items-center mt-4">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              <button
                onClick={handlePost}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* =========================
            FEED POSTS
        ========================= */}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No posts yet</p>
        )}

        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-2xl shadow-md mb-6"
          >
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{post.author?.name || "Unknown"}</h3>
                <p className="text-sm text-gray-400 capitalize">{post.author?.role || "N/A"}</p>
              </div>

              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>

                {/* =========================
                    DELETE BUTTON
                    - admin: can delete any post
                    - user/professional: only own post
                ========================= */}
                {(userRole === "admin" ||
                  post.author?._id?.toString() === userId?.toString()) && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Post"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-800 mb-3">{post.content}</p>

            {post.image && (
              <img
                src={`${baseUrl}/uploads/${post.image}`}
                alt="post"
                className="rounded-xl max-h-80 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;