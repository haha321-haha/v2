"use client";

import React from "react";
import { logError } from "@/lib/debug-logger";

type ClientErrorBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

type ClientErrorBoundaryState = {
  hasError: boolean;
};

export default class ClientErrorBoundary extends React.Component<
  ClientErrorBoundaryProps,
  ClientErrorBoundaryState
> {
  constructor(props: ClientErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ClientErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    logError(
      "ClientErrorBoundary caught error:",
      error,
      "ClientErrorBoundary/componentDidCatch",
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
