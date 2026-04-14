// pages/common/JoinRequestsPage.jsx
import { useAuth } from "./../../context/AuthContext";
import JoinRequests from "./joinRequests";

function JoinRequestsPage() {
  const { joinRequests } = useAuth();

  return <JoinRequests requests={joinRequests || []} />;
}

export default JoinRequestsPage;