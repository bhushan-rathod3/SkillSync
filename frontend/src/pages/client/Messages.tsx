import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { getConversations } from "../../api/messages";
import { showErrorToast } from "../../utils/toast";

interface Conversation {
  projectId: number;
  lastMessage: {
    id: number;
    message: string;
    createdAt: Date;
    sender: {
      id: number;
      name: string;
    };
    project: {
      id: number;
      title: string;
      status: string;
    };
  };
}

export default function ClientMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
      showErrorToast("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    }

    if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, "MMM d");
    }

    return format(messageDate, "MMM d, yyyy");
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Paper elevation={2} sx={{ p: 0 }}>
        {conversations.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary" gutterBottom>
              You don't have any messages yet.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/client/projects"
              sx={{ mt: 2 }}
            >
              View My Projects
            </Button>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {conversations.map((conversation, index) => (
              <React.Fragment key={conversation.projectId}>
                <ListItem
                  alignItems="flex-start"
                  component={Link}
                  to={`/client/projects/${conversation.projectId}?tab=messages`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {conversation.lastMessage.sender.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography component="span" variant="subtitle1">
                          {conversation.lastMessage.project.title}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatMessageTime(
                            conversation.lastMessage.createdAt
                          )}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{
                              display: "inline",
                              maxWidth: "70%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conversation.lastMessage.sender.name}:{" "}
                            {conversation.lastMessage.message}
                          </Typography>
                          <Chip
                            label={conversation.lastMessage.project.status}
                            size="small"
                            color={
                              conversation.lastMessage.project.status === "OPEN"
                                ? "primary"
                                : conversation.lastMessage.project.status ===
                                  "ASSIGNED"
                                ? "warning"
                                : "success"
                            }
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < conversations.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
