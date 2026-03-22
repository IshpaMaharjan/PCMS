import { useEffect, useState } from "react";
import axios from "axios";

function AdminFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${baseUrl}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!user || user.role !== "admin") return <p className="text-center mt-6">Access denied</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Feed</h1>

      {posts.length === 0 && <p className="text-center text-gray-500 mt-4">No posts yet</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white p-4 rounded-lg flex justify-between items-start border mb-2"
        >
          <div>
            <p className="font-medium">
              {post.author?.name || "Unknown"} ({post.author?.role || "N/A"})
            </p>
            <p>{post.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(post._id)}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminFeed;