import React from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Alert,
  Container,
  Link,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login as loginApi } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    try {
      const { access_token, refresh_token } = await loginApi(data);
      login(access_token, refresh_token);
      showSuccessToast("Login successful!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Invalid credentials";
      setError(errorMessage);
      showErrorToast(errorMessage);
      // Throw an error to prevent react-hook-form from considering this a successful submission
      throw new Error(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        mt={8}
        p={4}
        boxShadow={3}
        borderRadius={2}
        bgcolor="background.paper"
      >
        <Typography variant="h4" mb={3} textAlign="center">
          Login to SkillSync
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            error={!!errors.password}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              {...register("password", {
                required: "Password is required",
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && (
              <FormHelperText error>{errors.password.message}</FormHelperText>
            )}
          </FormControl>
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
              "Log In"
            )}
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Sign up here
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
