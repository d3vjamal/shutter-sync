import React from "react";

/** Renders nothing if a non-essential child (e.g. the banner carousel) throws, so it can't blank the page. */
export default class SilentErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Non-critical component failed:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
