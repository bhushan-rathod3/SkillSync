import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Alert,
  Container,
  Link,
  FormHelperText,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { register as registerApi } from "../../api/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { UserRole } from "../../types";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  bio: string;
  skills?: string[];
};

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "UI/UX",
  "SQL",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "TypeScript",
  "HTML/CSS",
  "Mobile Development",
  "DevOps",
  "Data Science",
  "Machine Learning",
];

export default function Register() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      role: UserRole.CLIENT,
      skills: [],
    },
  });

  const role = watch("role");
  const password = watch("password");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterFormInputs) => {
    setError("");
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      await registerApi(registerData);
      showSuccessToast("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Registration failed";
      setError(errorMessage);
      showErrorToast(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 2 }}>
        <Typography variant="h4" mb={3} textAlign="center">
          Create Your Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            label="Full Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <TextField
            {...register("bio", {
              required: "Bio is required",
              minLength: {
                value: 10,
                message: "Bio must be at least 10 characters",
              },
            })}
            label="Bio"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            error={!!errors.bio}
            helperText={errors.bio?.message}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select {...field} input={<OutlinedInput label="Role" />}>
                  <MenuItem value={UserRole.CLIENT}>Client</MenuItem>
                  <MenuItem value={UserRole.FREELANCER}>Freelancer</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {role === UserRole.FREELANCER && (
            <FormControl fullWidth margin="normal" error={!!errors.skills}>
              <InputLabel>Skills</InputLabel>
              <Controller
                control={control}
                name="skills"
                rules={{
                  validate: (value) =>
                    (value && value.length > 0) ||
                    "Please select at least one skill",
                }}
                render={({ field }) => (
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
                    input={<OutlinedInput label="Skills" />}
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.skills && (
                <FormHelperText>{errors.skills.message}</FormHelperText>
              )}
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Log in here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
