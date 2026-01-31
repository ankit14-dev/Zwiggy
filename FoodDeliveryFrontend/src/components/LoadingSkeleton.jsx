export default function LoadingSkeleton({ type = 'card', count = 1 }) {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    if (type === 'card') {
        return (
            <>
                {skeletons.map((i) => (
                    <div key={i} className="overflow-hidden">
                        {/* Image Skeleton */}
                        <div className="aspect-[16/11] bg-gray-200 rounded-2xl shimmer"></div>
                        {/* Content */}
                        <div className="pt-3">
                            <div className="flex justify-between items-start mb-2">
                                <div className="h-5 bg-gray-200 rounded w-2/3 shimmer"></div>
                                <div className="h-5 w-10 bg-gray-200 rounded shimmer"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1.5 shimmer"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3 shimmer"></div>
                        </div>
                    </div>
                ))}
            </>
        );
    }

    if (type === 'menuItem') {
        return (
            <>
                {skeletons.map((i) => (
                    <div key={i} className="flex gap-4 py-6 border-b border-gray-100">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2 shimmer"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 shimmer"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 mb-3 shimmer"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 shimmer"></div>
                        </div>
                        <div className="w-[118px] h-24 bg-gray-200 rounded-xl shimmer"></div>
                    </div>
                ))}
            </>
        );
    }

    if (type === 'text') {
        return (
            <>
                {skeletons.map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full mb-2 shimmer"></div>
                ))}
            </>
        );
    }

    return null;
}
