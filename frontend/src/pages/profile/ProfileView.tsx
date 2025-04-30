import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

export const ProfileView = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Link to="/profile/edit">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role}</p>
              <p className="mt-4">{user.bio || "No bio provided yet."}</p>

              {user.role === "freelancer" && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional sections could be added here based on user role */}
      {user.role === "freelancer" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          {/* Project list would go here */}
          <p className="text-gray-500">No active projects at the moment.</p>
        </div>
      )}

      {user.role === "client" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Posted Projects</h2>
          {/* Project list would go here */}
          <p className="text-gray-500">No projects posted yet.</p>
        </div>
      )}
    </div>
  );
};
