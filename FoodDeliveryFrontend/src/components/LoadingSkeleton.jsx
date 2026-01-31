export default function LoadingSkeleton({ type = 'card', count = 1 }) {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    if (type === 'card') {
        return (
            <>
                {skeletons.map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
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
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-100 animate-pulse">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </>
        );
    }

    if (type === 'text') {
        return (
            <>
                {skeletons.map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                ))}
            </>
        );
    }

    return null;
}
