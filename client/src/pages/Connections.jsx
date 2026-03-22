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

  /* ================= FETCH MY CONNECTIONS ================= */
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
        if (conn.sender?._id && conn.receiver?._id) {
          const otherUser =
            conn.sender._id === currentUser.id
              ? conn.receiver._id
              : conn.sender._id;
          statusMap[otherUser] = conn.status;
        }
      });
      setConnectionStatusMap(statusMap);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  /* ================= LOAD PREVIOUS SEARCH RESULTS ================= */
  useEffect(() => {
    fetchConnections();

    const savedUsers = localStorage.getItem(localStorageKey);
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  /* ================= LIVE SEARCH (Debounce) ================= */
  useEffect(() => {
    if (!keyword.trim()) return;

    const delayDebounce = setTimeout(async () => {
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
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  /* ================= BUTTON SEARCH ================= */
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
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= SEND REQUEST ================= */
  const handleSendRequest = async (receiverId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/connections/send/${receiverId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setConnectionStatusMap((prev) => ({
        ...prev,
        [receiverId]: "pending",
      }));

      fetchConnections();
    } catch (err) {
      console.error("Send request error:", err);
    }
  };

  /* ================= ACCEPT REQUEST ================= */
  const handleAcceptRequest = async (connectionId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/connections/accept/${connectionId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      fetchConnections();
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Connections</h2>

        {/* Search */}
        <div className="relative mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search for users..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
          >
            Search
          </button>

          {showDropdown && users.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-14 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {users.map((user) => {
                const status = connectionStatusMap[user._id] || "none";
                return (
                  <div
                    key={user._id}
                    onClick={() => setShowDropdown(false)}
                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <div>
                      {status === "none" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendRequest(user._id);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          Connect
                        </button>
                      )}
                      {status === "pending" && (
                        <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
                          Pending
                        </span>
                      )}
                      {status === "accepted" && (
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded">
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Results */}
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Search Results</h3>
        {users.length === 0 && !loading && (
          <p className="text-gray-500 mb-4">
            No users found yet. Start typing to search.
          </p>
        )}

        <div className="grid gap-4">
          {users.map((user) => {
            const status = connectionStatusMap[user._id] || "none";
            return (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-xl transition"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <div>
                  {status === "none" && (
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Connect
                    </button>
                  )}
                  {status === "pending" && (
                    <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded">
                      Pending
                    </span>
                  )}
                  {status === "accepted" && (
                    <span className="bg-green-200 text-green-800 px-4 py-2 rounded">
                      Connected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Received Requests */}
        <h3 className="text-xl font-semibold mt-10 mb-3 text-gray-700">
          Received Requests
        </h3>
        <div className="grid gap-4">
          {connections
            .filter((c) => c.receiver?._id === currentUser.id && c.status === "pending")
            .map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-xl transition"
              >
                <p className="font-semibold">{c.sender?.name}</p>
                <button
                  onClick={() => handleAcceptRequest(c._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Accept
                </button>
              </div>
            ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
