import Summarize from '@/components/Summarize';

export default function SummarizePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Summarize paperId={params.id as string} />
    </div>
  );
}
