import ProfileCard from "@/components/ProfileCard";
import { DEMO_ADVOCATE } from "@/lib/demoData";

export const metadata = {
  title: `${DEMO_ADVOCATE.fullName} | Digital Chamber`,
  description: `View the digital chamber of ${DEMO_ADVOCATE.fullName}. ${DEMO_ADVOCATE.specializations.join(", ")} advocate with ${DEMO_ADVOCATE.yearsExp} years of experience.`,
};

// No Navbar — pure profile card experience (like Linktree)
export default function DemoPage() {
  return <ProfileCard advocate={DEMO_ADVOCATE} />;
}
