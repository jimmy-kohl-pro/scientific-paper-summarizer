import { NextResponse } from 'next/server';
import { runPipeline } from '@/utils/instillApi';
import { AxiosResponse } from 'axios';

export async function POST(request: Request) {
  const { paper, profile } = await request.json();

  try {
    const response = await runPipeline(
      'article-generator',
      [
        {
            source: paper,
            target_audience: profile
        }
      ]
    ).catch((error) => {
        console.error('Error summarizing paper:', error.config.data, error.response.data);
    }) as AxiosResponse;
    console.log('article:', JSON.stringify(response.data, null, 2));
    // console.log('summaryResponse:', summaryResponse?.data?.outputs?.[0].summaryResponse?.[0]?.paper_summarized?.[0]);


    return NextResponse.json({ article: response.data?.outputs[0].article, image: response.data?.outputs[0].image });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}


