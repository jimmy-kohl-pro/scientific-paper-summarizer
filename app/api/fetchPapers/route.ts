import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const filter = searchParams.get('filter') || '';
    const sort = searchParams.get('sort') || '';

    const apiKey = process.env.SPRINGER_NATURE_API_KEY;
    const url = `https://api.springernature.com/meta/v2/json?q=${query}&filter=${filter}&sort=${sort}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}
