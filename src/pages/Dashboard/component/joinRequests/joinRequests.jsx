import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './joinRequests.module.css';

function JoinRequests({ requests, filter = 'pending' }) {
  const { approveRequest, rejectRequest } = useAuth();
  const [activeTab, setActiveTab] = useState(filter);
  const [processing, setProcessing] = useState(null);

  const filteredRequests = requests.filter(r => r.status === activeTab);

  const handleApprove = async (id) => {
    setProcessing(id);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
    approveRequest(id);
    setProcessing(null);
  };

  const handleReject = async (id) => {
    setProcessing(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    rejectRequest(id);
    setProcessing(null);
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Join Requests</h3>
        <div className={styles.tabs}>
          {['pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {filteredRequests.length === 0 ? (
          <div className={styles.empty}>No {activeTab} requests</div>
        ) : (
          filteredRequests.map(request => (
            <div key={request._id} className={styles.requestItem}>
              <div className={styles.avatar}>
                {request.name.charAt(0)}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{request.name}</span>
                <span className={styles.details}>
                  {request.role === 'student' 
                    ? `${request.class} • ${request.branch}`
                    : `${request.department} • Teacher`
                  }
                </span>
                <span className={styles.time}>{formatTime(request.requestedAt)}</span>
              </div>
              {activeTab === 'pending' && (
                <div className={styles.actions}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(request._id)}
                    disabled={processing === request._id}
                  >
                    {processing === request._id ? '...' : 'Accept'}
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleReject(request._id)}
                    disabled={processing === request._id}
                  >
                    Reject
                  </button>
                </div>
              )}
              {activeTab !== 'pending' && (
                <span className={`${styles.statusBadge} ${styles[activeTab]}`}>
                  {activeTab}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <button className={styles.viewAllBtn}>View Full Reports</button>
    </div>
  );
}

export default JoinRequests;
