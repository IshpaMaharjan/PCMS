import React, { useState, useEffect } from "react";
import axios from "axios";

const Feed = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  /* =========================
     LOAD POSTS SAFELY
  ========================= */

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/posts/feed",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        setPosts(res.data);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error(error);
        }
      }
    };

    loadPosts();

    return () => controller.abort();
  }, [token]);

  /* =========================
     HANDLE POST
  ========================= */

  const handlePost = async () => {
    if (!content.trim()) return alert("Write something!");

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post(
        "http://localhost:5000/api/posts/feed",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setContent("");
      setImage(null);
      setPreview(null);

      // manually refresh after posting
      const res = await axios.get(
        "http://localhost:5000/api/posts/feed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Share Your Achievement 🎉
          </h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your achievement..."
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            rows="3"
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

        {/* Feed Posts */}
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-2xl shadow-md mb-6"
          >
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {post.author.name}
                </h3>
                <p className="text-sm text-gray-400 capitalize">
                  {post.author.role}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            <p className="text-gray-800 mb-3">{post.content}</p>

            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
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