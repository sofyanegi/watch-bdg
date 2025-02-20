export default function SkeletonCard() {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div className="flex justify-between items-center p-3 border-t dark:border-gray-700">
        <div className="w-2/3 h-5 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}
