import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getConversations } from "../api/messages";
import { useAuthContext } from "../contexts/AuthProvider";
import { UserRole } from "../types";

const ConversationsList: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<
    { projectId: number; lastMessage: any }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getConversations();
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        setConversations(response.data.data);
      } else {
        setError("Failed to load conversations");
        console.error("Unexpected response format:", response.data);
      }
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      setError("An error occurred while fetching conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (projectId: number) => {
    // Navigate to the project details page with the messages tab active
    if (user?.role === UserRole.CLIENT) {
      navigate(`/client/projects/${projectId}?tab=messages`);
    } else {
      navigate(`/freelancer/projects/${projectId}?tab=messages`);
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), "MMM d, h:mm a");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Messages
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {conversations.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <Typography color="text.secondary">No conversations yet</Typography>
        </Box>
      ) : (
        <List>
          {conversations.map((conversation) => {
            const { projectId, lastMessage } = conversation;
            const isUserSender = lastMessage.sender.id === user?.id;
            const otherPerson = isUserSender
              ? lastMessage.receiver
              : lastMessage.sender;

            return (
              <React.Fragment key={projectId}>
                <ListItem
                  component="button"
                  onClick={() => handleConversationClick(projectId)}
                  alignItems="flex-start"
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar>{otherPerson.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {otherPerson.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatMessageTime(lastMessage.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "250px",
                          }}
                        >
                          {isUserSender ? "You: " : ""}
                          {lastMessage.message}
                          {lastMessage.attachment && " [Attachment]"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Project: {lastMessage.project.title}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default ConversationsList;
