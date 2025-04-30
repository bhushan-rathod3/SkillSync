import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../../../services/projectService";
import { Project } from "../../../types/project.types";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";
import { FeaturesImages } from "../../../components/FeaturesImages";

export const ClientDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientProjects = async () => {
      try {
        // In a real implementation, you would have an endpoint to get client's projects
        // For now, we'll use the getAllProjects and filter client-side
        const allProjects = await projectService.getProjects();
        const clientProjects = allProjects.filter(
          (project) => project.client?.id === user?.id
        );
        setProjects(clientProjects);
      } catch (error) {
        console.error("Error fetching client projects:", error);
        console.error("Failed to load your projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientProjects();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Link to="/projects/create">
          <Button>Create Project</Button>
        </Link>
      </div>

      {/* Features section - only show for new clients with no projects */}
      {projects.length === 0 && <FeaturesImages />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-green-600">
            {projects.filter((p) => p.status === "assigned").length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Completed Projects</h2>
          <p className="text-3xl font-bold text-gray-600">
            {projects.filter((p) => p.status === "completed").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Your Projects</h2>

        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't created any projects yet
            </p>
            <Link to="/projects/create">
              <Button>Create Your First Project</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${project.budget}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === "open"
                            ? "bg-green-100 text-green-800"
                            : project.status === "assigned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/projects/${project.id}/messages`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Messages
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
