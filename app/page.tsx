import StaticContent from "@/components/homepage/StaticContent";
import ClientAnimations from "@/components/homepage/ClientAnimations";
import InteractiveElements from "@/components/homepage/InteractiveElements";
import AuthHandler from "@/components/homepage/AuthHandler";

export default function Home() {
  return (
    <>
      <AuthHandler />
      <StaticContent />
      <ClientAnimations />
      <InteractiveElements />
    </>
  );
}
