import { NextResponse } from 'next/server';
import client from '@/utils/instillClient';

export async function POST(request: Request) {
  const { paperText, profile } = await request.json();

  try {
    const summaryResponse = await client.Pipeline.triggerUserPipelineAction({
        pipelineName: 'summarizationPipeline',
        payload: {
            inputs: [
                {
                    text: paperText,
                    profile: profile
                }
            ]
        }
    });

    const qnaResponse = await client.Pipeline.triggerUserPipelineAction({
      pipelineName: 'qnaPipeline',
      payload: {
          inputs: [
              {
                  text: paperText
              }
            ]
        }
    });

    return NextResponse.json({ summary: summaryResponse, qna: qnaResponse });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
