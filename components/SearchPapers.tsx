'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Creator {
    creator: string;
    ORCID?: string;
}

interface Discipline {
    id: string;
    term: string;
}

interface PaperLink {
    format: string;
    platform: string;
    value: string;
}

interface PaperItem {
    abstract: string;
    contentType: string;
    copyright: string;
    coverDate: string;
    creators: Creator[];
    disciplines: Discipline[];
    genre?: string[] | string;
    identifier: string;
    language: string;
    onlineDate: string;
    printDate: string;
    publicationDate: string;
    publicationName: string;
    publicationType: string;
    publisher: string;
    publisherName: string;
    subjects: string[];
    title: string;
    url: PaperLink[];
}

const SearchPapers = () => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');
    const [papers, setPapers] = useState<PaperItem[]>([]);
    const router = useRouter();

    const handleSummarize = (paperId: string) => {
        router.push(`/summarize?id=${encodeURIComponent(paperId)}`);
    };

    const [loading, setLoading] = useState(false);

    const searchPapers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/fetchPapers', {
                params: { query, filter, sort }
            });
            setPapers(response.data);
        } catch (error) {
            console.error('Error fetching papers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchPapers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Search Scientific Papers</h1>
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex space-x-4 mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-1/2 p-2 border rounded"
                    >
                        <option value="">Category</option>
                        <option value="cs">Computer Science</option>
                        <option value="bio">Biology</option>
                        {/* Add more categories */}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-1/2 p-2 border rounded"
                    >
                        <option value="">Sort By</option>
                        <option value="newest">Newest</option>
                        <option value="trending">Trending</option>
                        {/* Add more sorting options */}
                    </select>
                </div>
                <button
                    onClick={searchPapers}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Search
                </button>
            </div>

            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    papers.map((paper, index) => (
                        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">{paper.title}</h2>
                            <p>{paper.abstract}</p>
                            <div className="mt-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Publication Date: {paper.publicationDate}</p>
                                        <p className="text-sm text-gray-500">Publisher: {paper.publisherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Language: {paper.language}</p>
                                        <p className="text-sm text-gray-500">Genre: {Array.isArray(paper.genre) ? paper.genre.join(', ') : paper.genre}</p>
                                     </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleSummarize(paper.identifier)}
                                        className="bg-green-500 text-white p-2 rounded"
                                    >
                                        Summarize & Q&A
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchPapers;
