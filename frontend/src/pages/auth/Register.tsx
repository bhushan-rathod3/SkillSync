import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { UserRole } from "../../types";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  terms: boolean;
};

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
      terms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!data.terms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting registration form:", {
        name: data.name,
        email: data.email,
        role: data.role,
      });

      await registerUser(data.name, data.email, data.password, data.role);

      toast.success("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          toast.error(
            (axiosError.response.data as any)?.message ||
              "Registration failed. Please try again."
          );
        } else if (axiosError.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Paper radius="md" p="xl" withBorder className="w-full max-w-md">
        <Text size="lg" fw={500} className="text-center mb-2">
          Create Your Account
        </Text>
        <Text size="sm" c="dimmed" className="text-center mb-4">
          Join SkillSync and start collaborating
        </Text>

        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            leftSection={
              <div className="icon-container">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            }
          >
            Google
          </Button>
          <Button
            variant="default"
            leftSection={
              <div className="icon-container">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </div>
            }
          >
            GitHub
          </Button>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <Stack>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
              }}
              render={({ field }) => (
                <TextInput
                  required
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  radius="md"
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextInput
                  required
                  label="Email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  radius="md"
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <PasswordInput
                  required
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  radius="md"
                  {...field}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field }) => (
                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  radius="md"
                  {...field}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="I am a"
                  placeholder="Select your role"
                  data={[
                    { value: "client", label: "Client - I need work done" },
                    {
                      value: "freelancer",
                      label: "Freelancer - I offer services",
                    },
                  ]}
                  {...field}
                />
              )}
            />

            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={field.value}
                  onChange={field.onChange}
                  error={
                    !field.value && "You must accept the terms and conditions"
                  }
                />
              )}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm" c="dimmed">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </Text>
            <Button type="submit" loading={isSubmitting}>
              Create Account
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};
