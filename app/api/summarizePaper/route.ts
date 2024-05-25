import { NextResponse } from 'next/server';
import { runPipeline } from '@/utils/instillApi';

export async function POST(request: Request) {
  const { paper, profile } = await request.json();

  console.log('paper:', {paper: JSON.stringify({
    text: paper.text,
    title: paper.title
    // profile: profile
})});
  try {
    const summaryResponse = await runPipeline(
      'summarization',
      [
        {
            paper
        }
      ]
    ).catch((error) => {
        console.error('Error summarizing paper:', error.config.data, error.response.data);
    });
    console.log('summaryResponse:', summaryResponse?.data?.outputs?.[0].summaryResponse?.[0]?.paper_summarized?.[0]);
    // const qnaResponse = await client.Pipeline.triggerUserPipelineAction({
    //   pipelineName: 'qna',
    //   payload: {
    //       inputs: [
    //           {
    //               text: paperText
    //           }
    //         ]
    //     }
    // });

    console.log('summaryResponse:', JSON.stringify(summaryResponse?.data?.outputs, null, 2));

    return NextResponse.json({ summary: summaryResponse?.data?.outputs[0].paper_summarized?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
