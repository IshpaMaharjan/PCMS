import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader, UserPlus, UserCheck, UserX, Clock, Search, Users, X } from "lucide-react";

export default function Connections() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);                   // confirmed search results (shown in main list)
  const [dropdownUsers, setDropdownUsers] = useState([]);   // live suggestions (dropdown only)
  const [connections, setConnections] = useState([]);
  const [connectionStatusMap, setConnectionStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  /* ================= FETCH CONNECTIONS ================= */
  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/connections/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setConnections(res.data);
      const statusMap = {};
      res.data.forEach((conn) => {
        // skip rejected — treat as no connection so Connect button reappears
        if (conn.status === "rejected") return;
        const otherUser =
          conn.sender._id === currentUser.id ? conn.receiver._id : conn.sender._id;
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
  }, []);

  /* ================= LIVE SEARCH (dropdown only) ================= */
  useEffect(() => {
    if (!keyword.trim()) {
      setDropdownUsers([]);
      setShowDropdown(false);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/connections/search?keyword=${keyword}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setDropdownUsers(res.data.filter((u) => u.role !== "admin"));
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
      setDropdownUsers([]);
      const res = await axios.get(
        `http://localhost:5000/api/connections/search?keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUsers(res.data.filter((u) => u.role !== "admin"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleSendRequest = async (id) => {
    await axios.post(
      `http://localhost:5000/api/connections/send/${id}`, {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleAcceptRequest = async (id) => {
    await axios.put(
      `http://localhost:5000/api/connections/accept/${id}`, {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchConnections();
  };

  const handleRejectRequest = async (id) => {
    await axios.put(
      `http://localhost:5000/api/connections/reject/${id}`, {},
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

  /* ================= HELPERS ================= */
  const getConnection = (userId) =>
    connections.find((c) => c.sender._id === userId || c.receiver._id === userId);

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  /* ================= BUTTON COMPONENTS ================= */
  const ConnectButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        color: "#fff", border: "none", borderRadius: "10px",
        padding: "8px 18px", fontSize: "13px", fontWeight: "600",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.4)"; }}
    >
      <UserPlus size={14} /> Connect
    </button>
  );

  const PendingBadge = () => (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: "#fef9c3", color: "#a16207", border: "1px solid #fde047",
      borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Clock size={12} /> Pending
    </span>
  );

  const CancelButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: "transparent", color: "#ef4444",
        border: "1px solid #fca5a5", borderRadius: "8px",
        padding: "6px 12px", fontSize: "12px", fontWeight: "600",
        cursor: "pointer", transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      <X size={12} /> Cancel
    </button>
  );

  const ConnectedBadge = () => (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: "#dcfce7", color: "#15803d", border: "1px solid #86efac",
      borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <UserCheck size={12} /> Connected
    </span>
  );

  const RemoveButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        background: "transparent", color: "#6b7280",
        border: "1px solid #d1d5db", borderRadius: "8px",
        padding: "6px 12px", fontSize: "12px", fontWeight: "600",
        cursor: "pointer", transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fca5a5"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#d1d5db"; }}
    >
      <UserX size={12} /> Remove
    </button>
  );

  const AcceptButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#fff", border: "none", borderRadius: "10px",
        padding: "8px 18px", fontSize: "13px", fontWeight: "600",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(16,185,129,0.45)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.35)"; }}
    >
      <UserCheck size={14} /> Accept
    </button>
  );

  const RejectButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "transparent", color: "#ef4444",
        border: "1.5px solid #fca5a5", borderRadius: "10px",
        padding: "8px 18px", fontSize: "13px", fontWeight: "600",
        cursor: "pointer", transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#ef4444"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#fca5a5"; }}
    >
      <UserX size={14} /> Reject
    </button>
  );

  /* ================= USER CARD ================= */
  const UserCard = ({ user, conn, status, isDropdown }) => (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isDropdown ? "10px 16px" : "16px 20px",
        background: isDropdown ? "transparent" : "#fff",
        borderRadius: isDropdown ? "0" : "14px",
        boxShadow: isDropdown ? "none" : "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        border: isDropdown ? "none" : "1px solid #f1f5f9",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        if (!isDropdown) {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.1)";
          e.currentTarget.style.borderColor = "#e0e7ff";
        } else {
          e.currentTarget.style.background = "#f8faff";
        }
      }}
      onMouseLeave={e => {
        if (!isDropdown) {
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
          e.currentTarget.style.borderColor = "#f1f5f9";
        } else {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: isDropdown ? "36px" : "44px",
          height: isDropdown ? "36px" : "44px",
          borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isDropdown ? "13px" : "15px", fontWeight: "700", color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {getInitials(user.name)}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: "600", fontSize: isDropdown ? "13px" : "15px", color: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>
            {user.name}
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginTop: "1px" }}>
            {user.role || "Member"}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {status === "none" && (
          <ConnectButton onClick={() => handleSendRequest(user._id)} />
        )}
        {status === "pending" && conn?.sender._id === currentUser.id && (
          <><PendingBadge /><CancelButton onClick={() => handleCancelRequest(conn._id)} /></>
        )}
        {status === "pending" && conn?.receiver._id === currentUser.id && (
          <PendingBadge />
        )}
        {status === "accepted" && (
          <><ConnectedBadge /><RemoveButton onClick={() => handleRemoveConnection(conn._id)} /></>
        )}
      </div>
    </div>
  );

  /* ================= DERIVED STATE ================= */
  const receivedRequests = connections.filter(
    (c) => c.receiver._id === currentUser.id && c.status === "pending"
  );

  const interacted = connections.filter(
    (c) =>
      c.status !== "rejected" &&
      (c.status === "accepted" ||
        (c.status === "pending" && c.sender._id === currentUser.id))
  );

  /* ================= RENDER ================= */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f8f9ff 0%, #f1f5ff 50%, #faf5ff 100%)",
        padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>

          {/* HEADER */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}>
                <Users size={20} color="#fff" />
              </div>
              <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1e293b" }}>
                Connections
              </h2>
            </div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", paddingLeft: "52px" }}>
              Find and manage your professional network
            </p>
          </div>

          {/* SEARCH */}
          <div style={{ position: "relative", marginBottom: "28px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={16} style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none",
                }} />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search people by name or role..."
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px",
                    border: "1.5px solid #e2e8f0", borderRadius: "12px",
                    fontSize: "14px", color: "#1e293b", outline: "none",
                    background: "#fff", transition: "all 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    boxSizing: "border-box",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  padding: "12px 24px", fontSize: "14px", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.4)"; }}
              >
                Search
              </button>
            </div>

            {/* DROPDOWN — live suggestions while typing */}
            {showDropdown && dropdownUsers.length > 0 && (
              <div
                ref={dropdownRef}
                style={{
                  position: "absolute", top: "58px", left: 0, right: "90px",
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  maxHeight: "280px", overflowY: "auto", zIndex: 100,
                }}
              >
                {dropdownUsers.map((user) => {
                  const status = connectionStatusMap[user._id] || "none";
                  const conn = getConnection(user._id);
                  return (
                    <UserCard key={user._id} user={user} conn={conn} status={status} isDropdown={true} />
                  );
                })}
              </div>
            )}
          </div>

          {/* SEARCH RESULTS — only shown after clicking Search */}
          {users.length > 0 && (
            <div style={{ marginBottom: "36px" }}>
              <p style={{
                fontSize: "12px", fontWeight: "600", color: "#94a3b8",
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px",
              }}>
                Search Results
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {users.map((user) => {
                  const status = connectionStatusMap[user._id] || "none";
                  const conn = getConnection(user._id);
                  return (
                    <UserCard key={user._id} user={user} conn={conn} status={status} isDropdown={false} />
                  );
                })}
              </div>
            </div>
          )}

          {/* SEARCHED RESULTS — accepted + pending sent by current user */}
          {interacted.length > 0 && (
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <p style={{
                  margin: 0, fontSize: "12px", fontWeight: "600", color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  Searched Results
                </p>
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", borderRadius: "20px",
                  padding: "2px 8px", fontSize: "11px", fontWeight: "700",
                }}>
                  {interacted.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {interacted.map((c) => {
                  const otherUser = c.sender._id === currentUser.id ? c.receiver : c.sender;
                  return (
                    <div
                      key={c._id}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "16px 20px", background: "#fff", borderRadius: "14px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                        border: "1px solid #f1f5f9", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "15px", fontWeight: "700", color: "#fff",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {getInitials(otherUser.name)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>
                            {otherUser.name}
                          </p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", marginTop: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                            {otherUser.role || "Member"}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {c.status === "accepted" && (
                          <><ConnectedBadge /><RemoveButton onClick={() => handleRemoveConnection(c._id)} /></>
                        )}
                        {c.status === "pending" && (
                          <><PendingBadge /><CancelButton onClick={() => handleCancelRequest(c._id)} /></>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECEIVED REQUESTS */}
          {receivedRequests.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <p style={{
                  margin: 0, fontSize: "12px", fontWeight: "600", color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  Received Requests
                </p>
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", borderRadius: "20px",
                  padding: "2px 8px", fontSize: "11px", fontWeight: "700",
                }}>
                  {receivedRequests.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {receivedRequests.map((c) => (
                  <div
                    key={c._id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px", background: "#fff", borderRadius: "14px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                      border: "1px solid #f1f5f9", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "15px", fontWeight: "700", color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {getInitials(c.sender.name)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>
                          {c.sender.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", marginTop: "1px", fontFamily: "'DM Sans', sans-serif" }}>
                          Wants to connect with you
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <AcceptButton onClick={() => handleAcceptRequest(c._id)} />
                      <RejectButton onClick={() => handleRejectRequest(c._id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
              <Loader size={22} style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} />
            </div>
          )}

        </div>
      </div>
    </>
  );
}