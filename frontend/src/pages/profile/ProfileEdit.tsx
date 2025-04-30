import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";

type ProfileFormData = {
  bio: string;
  skills: string;
};

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      bio: user?.bio || "",
      skills: user?.skills ? user.skills.join(", ") : "",
    },
  });

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Convert comma-separated skills to array
      const skillsArray = data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const updatedData = {
        bio: data.bio,
        skills: skillsArray,
      };

      await userService.updateProfile(updatedData);
      updateUser({ ...updatedData });
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <Link to="/profile">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
              {...register("bio")}
            ></textarea>
          </div>

          {user.role === "freelancer" && (
            <div className="space-y-2">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills (comma separated)
              </label>
              <input
                id="skills"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. JavaScript, React, Node.js"
                {...register("skills")}
              />
              <p className="text-sm text-gray-500">
                Enter your skills separated by commas
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
