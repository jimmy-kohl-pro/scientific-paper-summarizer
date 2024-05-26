// components/MdxRenderer.js
import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

interface MdxRendererProps {
  content: string;
}
const MdxRenderer = ({ content }: MdxRendererProps) => {
  const [mdxContent, setMdxContent] = React.useState<MDXRemoteSerializeResult | null>(null);

  React.useEffect(() => {
    const renderContent = async () => {
      const mdxSource = await serialize(content);
      setMdxContent(mdxSource);
    };

    renderContent();
  }, [content]);

  if (!mdxContent) return <p>Loading...</p>;

  return (
    <MDXProvider>
      <MDXRemote {...mdxContent} />
    </MDXProvider>
  );
};

export default MdxRenderer;
