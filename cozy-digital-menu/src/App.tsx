import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import MiniPreview from "./MiniPreview";
class PreviewBoundary extends React.Component<
  React.PropsWithChildren,
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.error.stack}</pre>
    ) : (
      this.props.children
    );
  }
}
function RoutedPreview() {
  const { pathname } = useLocation();
  return (
    <PreviewBoundary key={pathname}>
      <MiniPreview />
    </PreviewBoundary>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <RoutedPreview />
    </BrowserRouter>
  );
}
