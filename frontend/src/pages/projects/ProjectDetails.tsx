import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { bidService } from "../../services/bidService";
import { Project } from "../../types/project.types";
import { Bid, CreateBidPayload } from "../../types/bid.types";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";

type BidFormData = {
  bidAmount: number;
  durationDays: number;
  bidMessage: string;
};

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BidFormData>();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!id) return;

        const projectData = await projectService.getProject(parseInt(id));
        setProject(projectData);

        const bidsData = await bidService.getBidsForProject(parseInt(id));
        setBids(bidsData);
      } catch (error) {
        console.error("Error fetching project details:", error);
        console.error("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const onSubmitBid = async (data: BidFormData) => {
    try {
      if (!id) return;

      const newBid = await bidService.createBid(
        parseInt(id),
        data as CreateBidPayload
      );
      setBids([...bids, newBid]);
      setShowBidForm(false);
      reset();
      console.log("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
      console.error("Failed to place bid");
    }
  };

  const hasUserBid = bids.some((bid) => bid.freelancer.id === user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Project not found</p>
        <Link to="/projects">
          <Button className="mt-4">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/projects"
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
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              project.status === "open"
                ? "bg-green-100 text-green-800"
                : project.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Project Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {project.category}
              </p>
              <p>
                <span className="font-medium">Budget:</span> ${project.budget}
              </p>
              <p>
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Client:</span>{" "}
                {project.client?.name}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/projects/${project.id}/messages`}>
            <Button variant="outline">Messages</Button>
          </Link>

          {user?.role === "client" && project.client?.id === user.id && (
            <Link to={`/projects/${project.id}/milestones`}>
              <Button variant="outline">Milestones</Button>
            </Link>
          )}

          {user?.role === "freelancer" &&
            project.status === "open" &&
            !hasUserBid && (
              <Button onClick={() => setShowBidForm(true)}>Place Bid</Button>
            )}
        </div>
      </div>

      {showBidForm && user?.role === "freelancer" && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Place Your Bid</h2>

          <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-4">
            <div>
              <label
                htmlFor="bidAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bid Amount ($)
              </label>
              <input
                id="bidAmount"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("bidAmount", {
                  required: "Bid amount is required",
                  min: {
                    value: 1,
                    message: "Bid amount must be greater than 0",
                  },
                })}
              />
              {errors.bidAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bidAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="durationDays"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (days)
              </label>
              <input
                id="durationDays"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("durationDays", {
                  required: "Duration is required",
                  min: {
                    value: 1,
                    message: "Duration must be at least 1 day",
                  },
                })}
              />
              {errors.durationDays && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.durationDays.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bidMessage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cover Letter
              </label>
              <textarea
                id="bidMessage"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("bidMessage", {
                  required: "Cover letter is required",
                  minLength: {
                    value: 50,
                    message: "Cover letter should be at least 50 characters",
                  },
                })}
              ></textarea>
              {errors.bidMessage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bidMessage.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBidForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Bids ({bids.length})</h2>

        {bids.length === 0 ? (
          <p className="text-gray-500">No bids yet</p>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{bid.freelancer.name}</p>
                    <p className="text-sm text-gray-500">
                      Bid: ${bid.bidAmount} • Duration: {bid.durationDays} days
                    </p>
                  </div>

                  {user?.role === "freelancer" &&
                    bid.freelancer.id === user.id && (
                      <Button variant="outline" size="sm">
                        Edit Bid
                      </Button>
                    )}
                </div>

                <p className="text-gray-700">{bid.bidMessage}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
