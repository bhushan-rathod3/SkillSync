import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { milestoneService } from "../../services";
import { projectService } from "../../services";
import { Milestone, Project } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";

export const ProjectMilestones = () => {
  const { id } = useParams<{ id: string }>();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const projectData = await projectService.getProjectById(parseInt(id));
          setProject(projectData);

          const milestonesData = await milestoneService.getProjectMilestones(
            parseInt(id)
          );
          setMilestones(milestonesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load milestones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !description || !amount || !dueDate) return;

    setIsCreating(true);
    try {
      const newMilestone = await milestoneService.createMilestone(
        parseInt(id),
        {
          title,
          description,
          amount: parseFloat(amount),
          dueDate,
        }
      );

      setMilestones([...milestones, newMilestone]);
      resetForm();
      setShowForm(false);
      toast.success("Milestone created successfully!");
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast.error("Failed to create milestone");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteMilestone = async (milestoneId: number) => {
    try {
      await milestoneService.completeMilestone(milestoneId);

      // Update the milestone status
      const updatedMilestones = milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, status: "completed" }
          : milestone
      );

      setMilestones(updatedMilestones);
      toast.success("Milestone marked as completed!");
    } catch (error) {
      console.error("Error completing milestone:", error);
      toast.error("Failed to update milestone");
    }
  };

  const handleReleaseMilestone = async (milestoneId: number) => {
    try {
      await milestoneService.releaseMilestone(milestoneId);

      // Update the milestone status
      const updatedMilestones = milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, status: "paid" }
          : milestone
      );

      setMilestones(updatedMilestones);
      toast.success("Payment released successfully!");
    } catch (error) {
      console.error("Error releasing payment:", error);
      toast.error("Failed to release payment");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
    setDueDate("");
  };

  if (isLoading) {
    return <div>Loading milestones...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const isClient = user?.role === "client" && project.client.id === user.id;
  const isAssignedFreelancer =
    user?.role === "freelancer" && project.assignedFreelancer?.id === user.id;

  if (!isClient && !isAssignedFreelancer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          You don't have permission to view these milestones.
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

  // Calculate project progress
  const completedMilestones = milestones.filter(
    (m) => m.status === "completed" || m.status === "paid"
  ).length;
  const progressPercentage =
    milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0;

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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{project.title} - Milestones</h1>
            {isClient && (
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add Milestone"}
              </Button>
            )}
          </div>

          {/* Project Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Milestone Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Milestone</h2>
          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Milestone"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No milestones have been created yet.</p>
          {isClient && !showForm && (
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Create First Milestone
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{milestone.title}</h2>
                  <p className="text-gray-500 text-sm">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                      milestone.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : milestone.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {milestone.status.charAt(0).toUpperCase() +
                      milestone.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{milestone.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-gray-500">Amount:</span>{" "}
                  <span className="font-medium">${milestone.amount}</span>
                </div>

                {/* Action buttons based on role and status */}
                <div className="flex gap-2">
                  {isAssignedFreelancer && milestone.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteMilestone(milestone.id)}
                    >
                      Mark as Completed
                    </Button>
                  )}

                  {isClient && milestone.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReleaseMilestone(milestone.id)}
                    >
                      Release Payment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
