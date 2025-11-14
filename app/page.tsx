"use client";

import SidebarLeft from "../components/Sidebar-left";
import SidebarRight from "../components/Sidebar-right";
import MiddleContent from "../components/posts/MiddleContent";

export default function Home() {
  const posts = [
    {
      userAvatarUrl: "https://i.pravatar.cc/40?img=1",
      name: "Alice Johnson",
      feeling: "excited",
      withUser: "Bob Smith",
      postDate: "2h ago",
      postText: "Had a great day exploring the city!",
      postImages: [
        { src: "https://picsum.photos/600/400?random=1", alt: "City view" },
        { src: "https://picsum.photos/600/400?random=2", alt: "Cafe" },
      ],
      likesCount: 34,
      commentCount: 12,
      shareCount: 5,
      likedBy: ["Ryan Reynolds", "Eula Reyes"],
      totalLikedByOthers: 22,
      currentUserCommentAvatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      userAvatarUrl: "https://i.pravatar.cc/40?img=2",
      name: "Patrick Rodriguez",
      postDate: "5h ago",
      postText: "Loving the new music album!",
      postImages: [
        { src: "https://picsum.photos/600/400?random=3", alt: "Album cover" },
      ],
      likesCount: 56,
      commentCount: 8,
      shareCount: 3,
      likedBy: ["Emma Watson"],
      totalLikedByOthers: 15,
      currentUserCommentAvatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      userAvatarUrl: "https://i.pravatar.cc/40?img=3",
      name: "Emily Davis",
      postDate: "1d ago",
      postText: "Check out this beautiful landscape!",
      postImages: [
        { src: "https://picsum.photos/600/400?random=4", alt: "Landscape" },
        { src: "https://picsum.photos/600/400?random=5", alt: "Mountains" },
        { src: "https://picsum.photos/600/400?random=6", alt: "Lake" },
      ],
      likesCount: 120,
      commentCount: 25,
      shareCount: 10,
      likedBy: ["Chris Evans", "Scarlett Johansson"],
      totalLikedByOthers: 98,
      currentUserCommentAvatar: "https://i.pravatar.cc/40?img=12",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <aside className="hidden md:flex w-64 flex-shrink-0 h-screen fixed top-0 left-0">
        <SidebarLeft />
      </aside>

      <div className="md:hidden fixed top-16 right-4 z-[9999]">
        <SidebarLeft />
      </div>

      <MiddleContent posts={posts} className="flex-1 mx-auto md:ml-64 md:mr-64" />

      <aside className="hidden md:flex w-64 flex-shrink-0 h-screen fixed top-0 right-0">
        <SidebarRight />
      </aside>
    </div>
  );
}
