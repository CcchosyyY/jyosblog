import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  const results = posts.map((p) => ({
    title: p.title,
    description: p.description,
    slug: p.slug,
    category: p.category,
  }));
  return NextResponse.json(results);
}
