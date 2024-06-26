import { NextResponse } from 'next/server';
import axios from 'axios';
import { searchPaperByQuery } from '@/utils/springerApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    // const filter = searchParams.get('filter') || '';
    // const sort = searchParams.get('sort') || '';


    try {
        const result = await searchPaperByQuery(query, '', '');
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}
