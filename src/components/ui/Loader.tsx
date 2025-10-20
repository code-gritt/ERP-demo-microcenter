'use client';

export function LoaderSpinner({ size = 'w-12 h-12' }: { size?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className={`border-4 border-white/20 border-t-white rounded-full animate-spin ${size}`}
            />
        </div>
    );
}
