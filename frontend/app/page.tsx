import TickersPanel from '../components/TickersPanel';
import ChartPanel from '../components/ChartPanel';
import SuspenseBoundary from '../components/SuspenseBoundary';

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px,1fr]">
      <SuspenseBoundary fallback={<SkeletonCard title="Tickers" />}>
        <TickersPanel />
      </SuspenseBoundary>
      <SuspenseBoundary fallback={<SkeletonCard title="Chart" />}>
        <ChartPanel />
      </SuspenseBoundary>
    </div>
  );
}

function SkeletonCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
      <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}
