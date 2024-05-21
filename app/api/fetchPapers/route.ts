import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const filter = searchParams.get('filter') || '';
    const sort = searchParams.get('sort') || '';

    return NextResponse.json([
        {
            title: 'Paper 1',
            summary: 'This is a summary of paper 1',
        },
        {
            title: 'Paper 2',
            summary: 'This is a summary of paper 2',
        },
        {
            title: 'Paper 3',
            summary: 'This is a summary of paper 3',
        }
    ]);
    const url = `https://api.example.com/search?query=${query}&filter=${filter}&sort=${sort}`;

    try {
        const response = await axios.get(url);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}
