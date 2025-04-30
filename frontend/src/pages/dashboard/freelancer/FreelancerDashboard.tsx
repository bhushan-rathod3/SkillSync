import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bidService } from "../../../services/bidService";
import { projectService } from "../../../services/projectService";
import { Bid } from "../../../types/bid.types";
import { Project } from "../../../types/project.types";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";
import { FeaturesImages } from "../../../components/FeaturesImages";

export const FreelancerDashboard = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        // In a real implementation, you would have endpoints to get freelancer's bids and active projects
        // For now, we'll simulate this with the available endpoints

        // Get all projects
        const allProjects = await projectService.getProjects();

        // Get all bids for each project and filter by freelancer
        const allBids: Bid[] = [];
        const freelancerActiveProjects: Project[] = [];

        for (const project of allProjects) {
          const projectBids = await bidService.getBidsForProject(project.id);

          // Filter bids by current freelancer
          const freelancerBids = projectBids.filter(
            (bid) => bid.freelancer.id === user?.id
          );

          allBids.push(...freelancerBids);

          // If project is in progress and freelancer has a bid, add to active projects
          if (
            project.status === "assigned" &&
            freelancerBids.some((bid) => bid.status === "accepted")
          ) {
            freelancerActiveProjects.push(project);
          }
        }

        setBids(allBids);
        setActiveProjects(freelancerActiveProjects);
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
        console.error("Failed to load your dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancerData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Freelancer Dashboard</h1>

      {/* Features section - only show for new freelancers with no bids */}
      {bids.length === 0 && <FeaturesImages />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Total Bids</h2>
          <p className="text-3xl font-bold text-blue-600">{bids.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-green-600">
            {activeProjects.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Success Rate</h2>
          <p className="text-3xl font-bold text-purple-600">
            {bids.length > 0
              ? `${Math.round(
                  (bids.filter((bid) => bid.status === "accepted").length /
                    bids.length) *
                    100
                )}%`
              : "0%"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Your Active Projects</h2>

          {activeProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You don't have any active projects
              </p>
              <Link to="/projects">
                <Button>Browse Projects</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-lg font-medium text-blue-600 hover:underline"
                  >
                    {project.title}
                  </Link>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{project.category}</span>
                    <span>${project.budget}</span>
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/projects/${project.id}/messages`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Messages
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Your Recent Bids</h2>

          {bids.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't placed any bids yet
              </p>
              <Link to="/projects">
                <Button>Browse Projects</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bids.slice(0, 5).map((bid) => (
                <div key={bid.id} className="border rounded-lg p-4">
                  <Link
                    to={`/projects/${bid.project?.id}`}
                    className="text-lg font-medium text-blue-600 hover:underline"
                  >
                    {bid.project?.title}
                  </Link>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">
                      Your bid: ${bid.bidAmount} • {bid.durationDays} days
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bid.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : bid.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {bid.bidMessage}
                  </p>
                </div>
              ))}

              {bids.length > 5 && (
                <div className="text-center mt-2">
                  <Link to="/bids" className="text-blue-600 hover:underline">
                    View all bids
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
