'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export interface PaperItem {
    id: number;
    title: string;
    summary: string;
}

const SearchPapers = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const router = useRouter();

  const searchPapers = async () => {
    try {
      const response = await axios.get('/api/fetchPapers', {
        params: { query, filter, sort }
      });
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

const handleSummarize = (paper: PaperItem) => {
    router.push(`/summarize/${paper.id}`);
};

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
        {papers.map((paper, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{paper.title}</h2>
            <p>{paper.summary}</p>
            <button
              onClick={() => handleSummarize(paper)} // Assuming paper.text contains the full text of the paper
              className="bg-green-500 text-white p-2 mt-2 rounded"
            >
                Summarize & Q&A
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPapers;
