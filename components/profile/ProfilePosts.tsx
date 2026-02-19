"use client";

import { useRouter } from "next/navigation";

export default function ProfilePosts({ posts }: any) {
  const router = useRouter();

  if (!posts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-xl rounded-3xl border border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-neutral-400 font-medium">No posts yet</p>
        <p className="text-neutral-600 text-sm mt-1">Posts will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-xl rounded-3xl border border-white/10 p-4">
      <div className="grid grid-cols-3 gap-3">
        {posts.map((post: any) => {
          const previewMedia = post.media?.[0];

          return (
            <div
              key={post._id}
              className="relative aspect-square bg-neutral-800/80 cursor-pointer group overflow-hidden rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300"
              onClick={() => router.push(`/post/${post._id}`)}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-orange-600/10 transition-all duration-500 z-10" />

              {previewMedia ? (
                previewMedia.type === "video" ? (
                  <video
                    src={previewMedia.url}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={previewMedia.url}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-center">
                  <p className="text-neutral-500 text-xs line-clamp-4">{post.text?.slice(0, 60)}</p>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-white text-xs font-medium">View</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}