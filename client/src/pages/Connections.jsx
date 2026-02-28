import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Connections() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionStatusMap, setConnectionStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const dropdownRef = useRef(null);

  /* ================= FETCH MY CONNECTIONS ================= */
  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/connections/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setConnections(res.data);
      console.log("current user", currentUser);
      const statusMap = {};
      res.data.forEach((conn) => {
        console.log({sender: conn.sender, receiver: conn.receiver, status: conn.status});
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

  useEffect(() => {
    fetchConnections();
  }, []);

  /* ================= LIVE SEARCH (Debounce) ================= */
  useEffect(() => {
    if (!keyword.trim()) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

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

        setUsers(res.data);
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
      setShowDropdown(false); // hide dropdown

      const res = await axios.get(
        `http://localhost:5000/api/connections/search?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // update UI instantly
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchConnections();
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">Connections</h3>
      {/* SEARCH BAR */}
      <div className="relative flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>

        {/* DROPDOWN */}
        {showDropdown && users.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
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

      {/* LOADING */}
      {loading && <p className="text-gray-500 mb-4">Searching...</p>}

      {/* SEARCH RESULTS */}
      <h3 className="text-xl font-semibold mb-2">Search Results</h3>

      {users.length === 0 && !loading && (
        <p className="text-gray-500">No users found</p>
      )}

      <div className="grid gap-4">
        {users.map((user) => {
          const status = connectionStatusMap[user._id] || "none";

          return (
            <div
              key={user._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>

              <div>
                {status === "none" && (
                  <button
                    onClick={() => handleSendRequest(user._id)}
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

      {/* RECEIVED REQUESTS */}
      <h3 className="text-xl font-semibold mt-8 mb-2">
        Received Requests
      </h3>

      <div className="grid gap-4">
        {connections
          .filter(
            (c) =>
              c.receiver?._id === currentUser.id &&
              c.status === "pending"
          )
          .map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="font-semibold">{c.sender?.name}</p>

              <button
                onClick={() => handleAcceptRequest(c._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Accept
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}