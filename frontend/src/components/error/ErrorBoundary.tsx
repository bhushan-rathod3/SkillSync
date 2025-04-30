import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="md" py="xl">
          <Stack align="center" spacing="lg">
            <Title order={2} color="red">
              Oops! Something went wrong
            </Title>
            <Text size="lg">
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <Group>
              <Button onClick={this.handleReload} variant="filled">
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline">
                Go to Home
              </Button>
            </Group>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
