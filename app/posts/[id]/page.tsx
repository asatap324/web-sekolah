import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({ id: post.id }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostData(params.id);

  if (!post) return notFound();

  return (
    <article className="prose mx-auto py-8">
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
