









































































































import { useEffect, useState } from "react";
import styles from "./joinRequests.module.css";

import {
  getRequests,
  approveRequest,
  rejectRequest,
} from "./../../../../api/requestApi";

function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [processing, setProcessing] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const loadRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  
  const handleApprove = async (id) => {
    try {
      setProcessing(id);
      await approveRequest(id);
      await loadRequests();
    } catch (err) {
      alert(err.response?.data?.msg || "Approve failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessing(id);
      await rejectRequest(id);
      await loadRequests();
    } catch (err) {
      alert(err.response?.data?.msg || "Reject failed");
    } finally {
      setProcessing(null);
    }
  };

  
  const filtered = requests.filter((r) => r.status === activeTab);

  
  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      
      {}
      <div className={styles.header}>
        <h3 className={styles.title}>Join Requests</h3>

        <div className={styles.tabs}>
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No {activeTab} requests</div>
        ) : (
          filtered.map((req) => (
            <div key={req._id} className={styles.requestItem}>
              
              <div className={styles.avatar}>
                {req.name?.charAt(0)}
              </div>

              <div className={styles.info}>
                <span className={styles.name}>{req.name}</span>

                <span className={styles.details}>
                  {req.role === "student"
                    ? `${req.classId?.name || "Class"} • ${req.section || ""}`
                    : `${req.departmentId?.name || "Dept"} • Teacher`}
                </span>

                <span className={styles.time}>
                  {formatTime(req.createdAt)}
                </span>
              </div>

              {}
              {activeTab === "pending" ? (
                <div className={styles.actions}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(req._id)}
                    disabled={processing === req._id}
                  >
                    {processing === req._id ? "..." : "Accept"}
                  </button>

                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(req._id)}
                    disabled={processing === req._id}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`${styles.statusBadge} ${styles[activeTab]}`}
                >
                  {activeTab}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {}
      <button className={styles.viewAllBtn}>
        View Full Reports
      </button>
    </div>
  );
}

export default JoinRequests;