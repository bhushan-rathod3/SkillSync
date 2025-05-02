import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  List,
  ListItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import { AttachFile, Send, InsertDriveFile } from "@mui/icons-material";
import { getMessages, sendMessage } from "../api/messages";
import { Message, User } from "../types";
import { useAuthContext } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { format } from "date-fns";

interface ProjectMessagesProps {
  projectId: number;
  receiverId: number;
  receiverName: string;
}

const ProjectMessages: React.FC<ProjectMessagesProps> = ({
  projectId,
  receiverId,
  receiverName,
}) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on component mount and when projectId changes
  useEffect(() => {
    fetchMessages();
  }, [projectId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMessages(projectId);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        // Filter messages based on the current conversation
        // If we're a client, only show messages between us and the selected freelancer (receiverId)
        // If we're a freelancer, show all messages between us and the client
        let filteredMessages = response.data.data;

        if (user?.role === "client" && receiverId) {
          // For clients, filter messages to only show the conversation with the selected freelancer
          filteredMessages = response.data.data.filter(
            (msg) =>
              (msg.sender.id === user.id && msg.receiver.id === receiverId) ||
              (msg.sender.id === receiverId && msg.receiver.id === user.id)
          );
        } else if (user?.role === "freelancer") {
          // For freelancers, only show messages where they are the sender or receiver
          filteredMessages = response.data.data.filter(
            (msg) => msg.sender.id === user.id || msg.receiver.id === user.id
          );
        }

        // Set messages from the filtered data
        setMessages(filteredMessages);
      } else {
        // Don't show error for empty messages
        if (
          response.data &&
          response.data.message &&
          response.data.message.includes("access")
        ) {
          setError("You don't have access to these messages yet");
        } else {
          console.log("No messages found or empty conversation");
          // Just set empty messages array without error
          setMessages([]);
        }
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      // Don't show error toast for 404 errors (no messages yet)
      if (err.response && err.response.status === 404) {
        // This is normal for new conversations - just set empty array
        console.log(
          "No messages found yet (404) - this is normal for new conversations"
        );
        setMessages([]);
      } else {
        // Only show error toast for non-404 errors
        console.log("Error response:", err.response);
        // Don't set error state for 404s to avoid showing error UI
        if (err.response && err.response.status !== 404) {
          setError("An error occurred while fetching messages");
          // Don't show toast for 404s
          showErrorToast("Failed to load messages");
        } else {
          // For 404s, just set empty messages
          setMessages([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) {
      showErrorToast("Please enter a message or attach a file");
      return;
    }

    setSending(true);
    try {
      // Create a FormData object for the message
      const messageData = {
        message: newMessage,
        attachment: attachment || undefined,
      };

      console.log("Sending message to:", receiverId, "for project:", projectId);

      const response = await sendMessage(projectId, receiverId, messageData);

      console.log("Send message response:", response.data);

      if (response.data && response.data.success) {
        // Clear the form regardless of response format
        setNewMessage("");
        setAttachment(null);
        showSuccessToast("Message sent successfully");

        // If we have a valid message object in the response, add it to the messages array
        if (response.data.data) {
          // Add the new message to the messages array
          setMessages([...messages, response.data.data]);
        }

        // Refresh messages to ensure we have the latest data
        setTimeout(() => {
          fetchMessages();
        }, 500); // Small delay to ensure the backend has processed the message
      } else {
        // Handle error response
        const errorMessage = response.data?.message || "Failed to send message";
        console.error("Error response:", response.data);
        showErrorToast(errorMessage);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      // Show more detailed error message if available
      let errorMessage = "An error occurred while sending your message";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Make sure we're not showing the message content as an error
      if (errorMessage === newMessage) {
        errorMessage = "Failed to send message";
      }

      showErrorToast(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !error.includes("don't have access")) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Messages with {receiverName}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Messages List */}
      <Box
        sx={{
          height: "400px",
          overflowY: "auto",
          mb: 2,
          p: 2,
          bgcolor: "background.default",
          borderRadius: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.sender.id === user?.id ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection:
                      message.sender.id === user?.id ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "80%",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.sender.id === user?.id
                          ? "primary.main"
                          : "secondary.main",
                    }}
                  >
                    {message.sender.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor:
                          message.sender.id === user?.id
                            ? "primary.light"
                            : "background.paper",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">{message.message}</Typography>
                      {message.attachmentUrl && (
                        <Box mt={1}>
                          <Button
                            startIcon={<InsertDriveFile />}
                            variant="outlined"
                            size="small"
                            onClick={async () => {
                              try {
                                // Create the download URL - encode the attachment URL to handle special characters
                                // We can safely assert non-null here because of the check at line 305
                                const baseUrl =
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:3000";
                                const downloadUrl = `${baseUrl}/messages/attachment/${encodeURIComponent(
                                  message.attachmentUrl as string
                                )}`;

                                console.log("Download URL:", downloadUrl);

                                // Show loading toast
                                const toastId = toast.loading(
                                  "Downloading file..."
                                );

                                // Fetch the file as a blob
                                const response = await fetch(downloadUrl, {
                                  method: "GET",
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                      "access_token"
                                    )}`,
                                  },
                                });

                                if (!response.ok) {
                                  // Log the response for debugging
                                  console.error("Download failed:", {
                                    status: response.status,
                                    statusText: response.statusText,
                                  });

                                  // Try to get more details from the response
                                  const errorText = await response.text();
                                  console.error("Error details:", errorText);

                                  throw new Error(
                                    `Download failed: ${response.status} ${response.statusText}`
                                  );
                                }

                                // Get the filename from the Content-Disposition header if available
                                const contentDisposition = response.headers.get(
                                  "Content-Disposition"
                                );
                                let filename = "attachment";

                                if (contentDisposition) {
                                  const filenameMatch =
                                    contentDisposition.match(
                                      /filename="(.+?)"/
                                    );
                                  if (filenameMatch && filenameMatch[1]) {
                                    filename = decodeURIComponent(
                                      filenameMatch[1]
                                    );
                                  }
                                }

                                // Convert response to blob
                                const blob = await response.blob();

                                // Create object URL
                                const url = window.URL.createObjectURL(blob);

                                // Create download link
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = filename;

                                // Trigger download
                                document.body.appendChild(link);
                                link.click();

                                // Clean up
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(link);

                                // Update toast
                                toast.update(toastId, {
                                  render: "File downloaded successfully",
                                  type: "success",
                                  isLoading: false,
                                  autoClose: 3000,
                                });
                              } catch (error) {
                                console.error("Download error:", error);
                                toast.error(
                                  `Failed to download file: ${
                                    error instanceof Error
                                      ? error.message
                                      : "Unknown error occurred"
                                  }`
                                );
                              }
                            }}
                          >
                            Download Attachment
                          </Button>
                        </Box>
                      )}
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {formatMessageTime(message.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box>
        {attachment && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              p: 1,
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
            <InsertDriveFile fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, flexGrow: 1 }}>
              {attachment.name}
            </Typography>
            <IconButton size="small" onClick={handleRemoveAttachment}>
              &times;
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              multiline
              maxRows={3}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </Box>
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Tooltip title="Attach file">
              <IconButton
                color="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <AttachFile />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSendMessage}
              disabled={sending || (!newMessage.trim() && !attachment)}
            >
              {sending ? <CircularProgress size={24} /> : "Send"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProjectMessages;
