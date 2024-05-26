import Summarize from '@/components/Summarize';

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const id = searchParams.id;

  return <Summarize paperId={id as string} />;
}
