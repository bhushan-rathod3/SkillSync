import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { toast } from "react-hot-toast";
import {
  Button,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Box,
} from "@mantine/core";

type ProjectFormData = {
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: string;
};

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Data Entry",
  "Other",
];

export const CreateProject = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      budget: 0,
      deadline: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await projectService.createProject(data);
      console.log("Project created successfully!");
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div>
      <Box mb={20}>
        <Link
          to="/projects"
          className="text-blue-600 hover:underline flex items-center"
        >
          <div
            className="icon-container"
            style={{ width: "16px", height: "16px", marginRight: "4px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          Back to Projects
        </Link>
      </Box>

      <Paper shadow="xs" p="md" radius="md">
        <Title order={2} mb="md">
          Create a New Project
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Project title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title must not exceed 100 characters",
                },
              }}
              render={({ field }) => (
                <TextInput
                  label="Project Title"
                  placeholder="Enter project title"
                  required
                  error={errors.title?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  label="Category"
                  placeholder="Select a category"
                  required
                  data={CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                  error={errors.category?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                required: "Description is required",
                minLength: {
                  value: 50,
                  message: "Description must be at least 50 characters",
                },
              }}
              render={({ field }) => (
                <Textarea
                  label="Description"
                  placeholder="Describe your project in detail"
                  required
                  minRows={5}
                  error={errors.description?.message}
                  {...field}
                />
              )}
            />

            <Group grow>
              <Controller
                name="budget"
                control={control}
                rules={{
                  required: "Budget is required",
                  min: {
                    value: 5,
                    message: "Budget must be at least $5",
                  },
                }}
                render={({ field }) => (
                  <NumberInput
                    label="Budget ($)"
                    placeholder="Enter budget amount"
                    required
                    min={5}
                    error={errors.budget?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="deadline"
                control={control}
                rules={{
                  required: "Deadline is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    return (
                      selectedDate > today || "Deadline must be in the future"
                    );
                  },
                }}
                render={({ field }) => (
                  <TextInput
                    label="Deadline"
                    type="date"
                    min={minDate}
                    required
                    error={errors.deadline?.message}
                    {...field}
                  />
                )}
              />
            </Group>

            <Group mt="md">
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/projects")}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};
