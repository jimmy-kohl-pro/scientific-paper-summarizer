import { NextResponse } from 'next/server';
import axios from 'axios';
// import { searchPaperById, searchPaperByQuery } from '@/utils/springerApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paperId') || '';
    // const filter = searchParams.get('filter') || '';
    // const sort = searchParams.get('sort') || '';

    console.log('paperId:', paperId);

    try {
        // const result = await searchPaperById(paperId);
        // return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}
