import { AppRouter } from "./routes";
import { Toaster } from "react-hot-toast";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";

// Create a theme with your brand colors
const theme = createTheme({
  primaryColor: "blue",
  colors: {
    blue: [
      "#e6f7ff", // 0
      "#bae7ff", // 1
      "#91d5ff", // 2
      "#69c0ff", // 3
      "#40a9ff", // 4
      "#1890ff", // 5 - Primary
      "#096dd9", // 6
      "#0050b3", // 7
      "#003a8c", // 8
      "#002766", // 9
    ],
  },
});

function App() {
  return (
    <ErrorBoundary>
      <MantineProvider theme={theme}>
        <AuthProvider>
          <AppRouter />
          <Toaster position="top-right" />
        </AuthProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;
