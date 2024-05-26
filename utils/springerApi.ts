import axios, { AxiosRequestConfig } from 'axios';
import path from 'path';
import fs from 'fs/promises';

const BASE_URL = 'https://api.springernature.com';
const apiKey = process.env.SPRINGER_NATURE_API_KEY;

interface RequestParams {
    path: string;
    params?: Record<string, any>;
    data?: Record<string, any>;
    method: 'get' | 'post' | 'put' | 'delete';
    headers?: Record<string, any>;
}

async function baseRequest({ path, params, data, method, headers }: RequestParams) {
    try {
        const response = await axios({
            method,
            url: `${BASE_URL}${path}`,
            params: {
                api_key: apiKey,
                ...params
            },
            data,
            headers
        });
        return response.data;
    } catch (error: any) {
        console.error('Error making request:', error.config.data, error.response.data);
        throw new Error(error?.message);
    }
}

export async function searchPaperByQuery(query: string, filter: string, sort: string) {
    const response = await baseRequest({
        path: '/meta/v2/json',
        params: {
            q: query,
        },
        method: 'get',
    });

    return response?.records;
}

export async function getFullTextById(paperId: string) {
    const response = await baseRequest({
        path: '/meta/v2/jats',
        params: {
            q: paperId,
        },
        method: 'get',
        headers: {
            'Accept': 'application/xml'
        }
    });

    console.log('response:', response);
    // // write response in a file
    // const filePath = path.join(__dirname, `../data/papers/${encodeURIComponent(paperId)}.json`);
    // await fs.writeFile(filePath, response);

    return response;
}