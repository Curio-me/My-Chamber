import { Suspense } from "react";
import AdvocateClientView from "./AdvocateClientView";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-sm text-[#8ab4f8]">
          Opening Virtual Chamber...
        </div>
      }
    >
      <AdvocateClientView slug={slug} />
    </Suspense>
  );
}
