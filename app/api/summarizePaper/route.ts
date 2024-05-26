import { NextResponse } from 'next/server';
import { runPipeline } from '@/utils/instillApi';
import { getFullTextById } from '@/utils/springerApi';

export async function POST(request: Request) {
  const { paperId, profile } = await request.json();

  try {
    const paperText = await getFullTextById(paperId);

    const summaryResponse = await runPipeline(
      'summarization',
      [
        {
            paper: paperText,
            profile: profile
        }
      ]
    ).catch((error) => {
        console.error('Error summarizing paper:', error.config.data, error.response.data);
    });
    // console.log('summaryResponse:', summaryResponse?.data?.outputs?.[0].summaryResponse?.[0]?.paper_summarized?.[0]);

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

    // console.log('summaryResponse:', JSON.stringify(summaryResponse?.data?.outputs, null, 2));

    return NextResponse.json({ summary: summaryResponse?.data?.outputs[0].paper_summarized?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}


