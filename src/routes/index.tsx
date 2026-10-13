import { createFileRoute } from "@tanstack/react-router";
import { CliffApp } from "@/components/cliff/app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <CliffApp />;
}
