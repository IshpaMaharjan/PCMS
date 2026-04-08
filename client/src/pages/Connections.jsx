import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

export default function Connections() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionStatusMap, setConnectionStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  const localStorageKey = `searchResults_${currentUser.id}`;

  /* ================= FETCH CONNECTIONS ================= */
  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/connections/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setConnections(res.data);

      const statusMap = {};
      res.data.forEach((conn) => {
        const otherUser =
          conn.sender._id === currentUser.id
            ? conn.receiver._id
            : conn.sender._id;

        statusMap[otherUser] = conn.status;
      });

      setConnectionStatusMap(statusMap);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchConnections();

    const saved = localStorage.getItem(localStorageKey);
    if (saved) setUsers(JSON.parse(saved));
  }, []);

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {
    if (!keyword.trim()) return;

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/connections/search?keyword=${keyword}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsers((prev) => {
          const newUsers = res.data.filter(
            (u) => !prev.some((p) => p._id === u._id)
          );
          const merged = [...prev, ...newUsers];
          localStorage.setItem(localStorageKey, JSON.stringify(merged));
          return merged;
        });

        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [keyword]);

  /* ================= SEARCH BUTTON ================= */
  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      setShowDropdown(false);

      const res = await axios.get(
        `http://localhost:5000/api/connections/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) => {
        const newUsers = res.data.filter(
          (u) => !prev.some((p) => p._id === u._id)
        );
        const merged = [...prev, ...newUsers];
        localStorage.setItem(localStorageKey, JSON.stringify(merged));
        return merged;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleSendRequest = async (id) => {
    await axios.post(
      `http://localhost:5000/api/connections/send/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleAcceptRequest = async (id) => {
    await axios.put(
      `http://localhost:5000/api/connections/accept/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleRejectRequest = async (id) => {
    await axios.put(
      `http://localhost:5000/api/connections/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleCancelRequest = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/connections/cancel/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleRemoveConnection = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/connections/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  /* ================= FIND CONNECTION ================= */
  const getConnection = (userId) => {
    return connections.find(
      (c) =>
        c.sender._id === userId || c.receiver._id === userId
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Connections</h2>

        {/* SEARCH */}
        <div className="relative mb-6 flex gap-3">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search users..."
            className="flex-1 border p-3 rounded-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Search
          </button>

          {/* DROPDOWN */}
          {showDropdown && users.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-14 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
            >
              {users.map((user) => {
                const status = connectionStatusMap[user._id] || "none";
                const conn = getConnection(user._id);

                return (
                  <div
                    key={user._id}
                    className="flex justify-between px-4 py-2 hover:bg-gray-100"
                  >
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>

                    {/* STATUS UI */}
                    {status === "none" && (
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Connect
                      </button>
                    )}

                    {status === "pending" &&
                      conn?.sender._id === currentUser.id && (
                        <div className="flex gap-2 items-center">
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                            Pending
                          </span>
                          <button
                            onClick={() => handleCancelRequest(conn._id)}
                            className="text-red-500 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                    {status === "pending" &&
                      conn?.receiver._id === currentUser.id && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                          Pending
                        </span>
                      )}

                    {status === "accepted" && (
                      <div className="flex gap-2 items-center">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                          Connected
                        </span>
                        <button
                          onClick={() => handleRemoveConnection(conn._id)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SEARCH RESULTS */}
        <div className="grid gap-4">
          {users.map((user) => {
            const status = connectionStatusMap[user._id] || "none";
            const conn = getConnection(user._id);

            return (
              <div
                key={user._id}
                className="flex justify-between bg-white p-4 rounded shadow"
              >
                <div>
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>

                {/* STATUS UI */}
                {status === "none" && (
                  <button onClick={() => handleSendRequest(user._id)}>
                    Connect
                  </button>
                )}

                {status === "pending" &&
                  conn?.sender._id === currentUser.id && (
                    <div className="flex gap-2 items-center">
                      <span className="bg-yellow-100 px-2 py-1 rounded text-sm">
                        Pending
                      </span>
                      <button onClick={() => handleCancelRequest(conn._id)}>
                        Cancel
                      </button>
                    </div>
                  )}

                {status === "pending" &&
                  conn?.receiver._id === currentUser.id && (
                    <span className="bg-yellow-100 px-2 py-1 rounded text-sm">
                      Pending
                    </span>
                  )}

                {status === "accepted" && (
                  <div className="flex gap-2 items-center">
                    <span className="bg-green-100 px-2 py-1 rounded text-sm">
                      Connected
                    </span>
                    <button onClick={() => handleRemoveConnection(conn._id)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RECEIVED REQUESTS */}
        <h3 className="mt-10 mb-3 font-semibold">Received Requests</h3>
        {connections
          .filter(
            (c) =>
              c.receiver._id === currentUser.id &&
              c.status === "pending"
          )
          .map((c) => (
            <div
              key={c._id}
              className="flex justify-between bg-white p-4 rounded shadow mb-3"
            >
              <p>{c.sender.name}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptRequest(c._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(c._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

        {loading && (
          <div className="flex justify-center mt-4">
            <Loader className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}