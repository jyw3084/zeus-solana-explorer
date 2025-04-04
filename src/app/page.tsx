'use client'

import ClusterStatsCard from "@/components/ClusterStatsCard";
import BlocksCard from "@/components/BlocksCard";

export default function Page() {
  return (
    <main className="container mx-auto p-8">
      <div className="space-y-8">
        <ClusterStatsCard />
        <BlocksCard />
      </div>
    </main>
  );
}