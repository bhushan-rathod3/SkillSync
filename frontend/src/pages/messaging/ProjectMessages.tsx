import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { messageService } from "../../services";
import { projectService } from "../../services";
import { Message, Project } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";

const usePolling = (callback: () => void, interval: number) => {
  useEffect(() => {
    const intervalId = setInterval(callback, interval);
    return () => clearInterval(intervalId);
  }, [callback, interval]);
};

export const ProjectMessages = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchProjectData = async () => {
    if (!id) return;
    try {
      const projectData = await projectService.getProjectById(parseInt(id));
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to load project data");
    }
  };

  const fetchMessages = async () => {
    if (!id) return;
    try {
      const messagesData = await messageService.getMessagesForProject(
        parseInt(id)
      );
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProjectData(), fetchMessages()]);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  usePolling(() => {
    if (id) fetchMessages();
  }, 10000);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !messageText.trim()) return;

    setIsSending(true);
    try {
      const newMessage = await messageService.sendMessage(parseInt(id), {
        content: messageText,
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const isUserInvolved =
    user?.role === "client"
      ? project.client?.id === user.id
      : project.assignedFreelancer?.id === user?.id ||
        project.bids?.some((bid) => bid.freelancer.id === user?.id);

  if (!isUserInvolved) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          You don't have permission to view these messages.
        </p>
        <Link
          to="/projects"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/projects/${project.id}`}
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Project
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">{project.title} - Messages</h1>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender.id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-xs mb-1">
                      {message.sender.name} •{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending || !messageText.trim()}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
