import Link from 'next/link';
import PostCard from '@/components/PostCard';
import CategorySidebar from '@/components/CategorySidebar';

import { getAllPosts, getPostCountByCategory } from '@/lib/posts';

export default async function Home() {
  const allPosts = await getAllPosts();
  const postCounts = await getPostCountByCategory();
  const recentPosts = allPosts.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <div className="flex gap-10">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="py-10">
            <h1 className="text-4xl font-bold text-foreground mb-5">
              Welcome to Jyo&apos;s Blog
            </h1>
            <p className="text-base text-subtle leading-relaxed mb-5">
              Exploring development, design, and life through writing.
            </p>
            <div className="flex gap-3">
              <Link
                href="/blog"
                className="px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
              >
                Read Blog
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-secondary text-secondary text-sm font-medium rounded-lg hover:bg-secondary/10 transition-colors"
              >
                About Me
              </Link>
            </div>
          </section>

          {/* Recent Posts */}
          <section className="py-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[22px] font-bold text-foreground">
                Recent Posts
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-link hover:text-primary transition-colors"
              >
                모든 글 보기 &rarr;
              </Link>
            </div>
            {recentPosts.length > 0 ? (
              <div className="grid gap-5">
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    slug={post.slug}
                    tags={post.tags}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted">
                  아직 작성된 글이 없습니다.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Side Column */}
        <div className="hidden lg:flex flex-col gap-6 w-[280px] shrink-0">
          {/* Profile Card */}
          <div className="p-5 bg-card border border-card-border rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-base font-semibold shrink-0">
                M
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">
                  Blog Author
                </h3>
                <p className="text-[13px] text-subtle">
                  Frontend Developer &amp; Writer
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <CategorySidebar postCounts={postCounts} />
        </div>
      </div>
    </div>
  );
}
