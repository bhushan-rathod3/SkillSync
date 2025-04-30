import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Login form submitted with email:", data.email);

      // Attempt login
      const userData = await login(data.email, data.password);
      console.log("Login successful, user data:", userData);

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);

      // More detailed error handling
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            toast.error("Invalid email or password");
          } else if (axiosError.response.status === 429) {
            toast.error("Too many login attempts. Please try again later.");
          } else {
            toast.error(
              (axiosError.response.data as any)?.message ||
                "Login failed. Please try again."
            );
          }
        } else if (axiosError.request) {
          // The request was made but no response was received
          toast.error("No response from server. Please check your connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("Login failed. Please try again.");
        }
      } else {
        // For non-Axios errors
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
          Welcome Back
        </Text>
        <Text size="sm" c="dimmed" className="text-center mb-4">
          Sign in to your SkillSync account
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

            <Group justify="space-between">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Remember me"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Anchor component="button" type="button" c="dimmed" size="sm">
                Forgot password?
              </Anchor>
            </Group>
          </Stack>

          <Group justify="space-between" mt="xl">
            <Text size="sm" c="dimmed">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </Text>
            <Button type="submit" loading={isSubmitting}>
              Sign in
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};
