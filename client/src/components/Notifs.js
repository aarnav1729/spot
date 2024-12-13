import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  background-color: #eef2f7;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #fff;
  box-sizing: border-box;
`;

const NotificationsTitle = styled.h1`
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 25px;
  font-weight: 700;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;

const FilterButton = styled.button`
  background-color: ${(props) => (props.active ? "#3498db" : "#bdc3c7")};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${(props) => (props.active ? "#2980b9" : "#95a5a6")};
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NotificationCard = styled.div`
  background-color: ${(props) => (props.isRead ? "#ecf0f1" : "#e8f6ff")};
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NotificationHeader = styled.h3`
  font-size: 20px;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: 600;
`;

const NotificationBody = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.5;
`;

const NotificationActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const MarkAsReadButton = styled.button`
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #27ae60;
  }
`;

const GoToTicketButton = styled.button`
  background-color: #e67e22;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d35400;
  }
`;

const Notifs = () => {
  const [notifications, setNotifications] = useState([]);
  const storedUsername = localStorage.getItem("username");
  const fullEmailUser = `${storedUsername}@premierenergies.com`;
  const [counts, setCounts] = useState({ all: 0, read: 0, unread: 0 });
  const [filter, setFilter] = useState("all"); // 'all', 'read', 'unread'
  const navigate = useNavigate();

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          params: { userID: fullEmailUser, filter },
        }
      );
      setNotifications(response.data.notifications);
      setCounts(response.data.counts);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (notifID) => {
    try {
      await axios.post("http://localhost:5000/api/notifications/mark-read", {
        notificationIDs: [notifID],
      });

      // Refetch notifications
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleGoToTicket = (ticketNumber) => {
    navigate(`/ticket/${ticketNumber}`);
  };

  return (
    <div>
      <Container>
        <Sidebar activeTab="Notifications" />
        <Content>
          <NotificationsTitle>Notifications</NotificationsTitle>

          <FilterButtons>
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All ({counts.all})
            </FilterButton>
            <FilterButton
              active={filter === "unread"}
              onClick={() => setFilter("unread")}
            >
              Unread ({counts.unread})
            </FilterButton>
            <FilterButton
              active={filter === "read"}
              onClick={() => setFilter("read")}
            >
              Read ({counts.read})
            </FilterButton>
          </FilterButtons>

          <NotificationList>
            {notifications.length === 0 ? (
              <NotificationCard>
                <NotificationBody>No notifications available.</NotificationBody>
              </NotificationCard>
            ) : (
              notifications.map((notif) => (
                <NotificationCard key={notif.ID} isRead={notif.IsRead === 1}>
                  <NotificationHeader>
                    {notif.UserID} {notif.Comment}
                  </NotificationHeader>
                  <NotificationBody>
                    <strong>From:</strong> {notif.Before_State || "N/A"}
                    <br />
                    <strong>To:</strong> {notif.After_State || "N/A"}
                    <br />
                    <strong>Ticket Number:</strong> {notif.HTicket_Number}
                    <br />
                    <strong>Time:</strong>{" "}
                    {new Date(notif.Timestamp).toLocaleString()}
                  </NotificationBody>
                  <NotificationActions>
                    {!notif.IsRead && (
                      <MarkAsReadButton
                        onClick={() => handleMarkAsRead(notif.ID)}
                      >
                        Mark as Read
                      </MarkAsReadButton>
                    )}
                    <GoToTicketButton
                      onClick={() => handleGoToTicket(notif.HTicket_Number)}
                    >
                      Go to Ticket
                    </GoToTicketButton>
                  </NotificationActions>
                </NotificationCard>
              ))
            )}
          </NotificationList>
        </Content>
      </Container>
    </div>
  );
};

export default Notifs;
