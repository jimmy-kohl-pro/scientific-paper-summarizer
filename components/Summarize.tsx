'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUserAstronaut, FaLaptopCode, FaUser, FaPlus, FaPaperPlane, FaChild, FaArrowLeft, FaFileAlt, FaNewspaper, FaTimes, FaRobot } from 'react-icons/fa';
import MdxRenderer from './MdxRenderer';
import { IconType } from 'react-icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Profile {
    key: string;
    label: string;
    text: string;
    icon?: IconType;
}

interface QnA {
    question: string;
    answer: string;
}

interface ArticleContent {
    title?: string;
    article: string;
    image: string;
}

const defaultProfiles: Profile[] = [
    {
        label: 'Casual Reader',
        key: 'casual',
        icon: FaUser,
        text: 'Casual reader profile. Summarize the following scientific paper in a way that makes it easy to understand for everyone, regardless of their scientific background. Break down complex concepts into simple terms, and highlight the main findings and their significance.'
    },
    {
        label: 'Scientist',
        key: 'scientist',
        icon: FaUserAstronaut,
        text: 'Scientist profile. Summarize the following scientific paper while retaining all technical details, methodologies, and specific findings. Ensure the summary is precise, includes relevant data, and uses scientific terminology appropriate for a professional audience.'
    },
    {
        label: 'Tech Enthusiast',
        key: 'tech',
        icon: FaLaptopCode,
        text: 'Tech enthusiast profile. Summarize the following scientific paper with an emphasis on the technological aspects, methodologies, and data analysis techniques used. Highlight any innovative approaches or tools involved in the research.'
    },
    {
        label: 'Child',
        key: 'child',
        icon: FaChild,
        text: 'Child profile. Summarize the following scientific paper in a fun and simple way that a child can understand. Use easy words and relatable examples to explain the main points and findings.'
    }
];

const Summarize = ({ paperId }: { paperId: string }) => {
    const [profile, setProfile] = useState<string>('casual');
    // const [summary, setSummary] = useState<string>('');
    const [conversation, setConversation] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
    const [chatWidth, setChatWidth] = useState(560);
    const chatRef = useRef<HTMLDivElement>(null);
    const resizerRef = useRef<HTMLDivElement>(null);
    const [showArticle, setShowArticle] = useState<boolean>(false);
    const [articleContent, setArticleContent] = useState<ArticleContent | undefined>(undefined);
    const [isLoadingArticle, setIsLoadingArticle] = useState<boolean>(false);


    // const { data: paperMetadata, isLoading: isLoadingPaperMetadata, isError: isErrorPaperMetadata } = useQuery(
    //     {
    //         queryFn: () => axios.get(`/api/getPaperMetadata?paperId=${encodeURIComponent(paperId)}`),
    //         queryKey: ['getPaperMetadata', paperId],
    //         enabled: !!paperId,
    //     }
    // );

    const { data: summaryData, isLoading: isLoadingSummary, isError: isErrorSummary } = useQuery<{ summary: string, source: string}>(
        {
            queryFn: async () => (await axios.post('/api/summarizePaper', {
                paperId,
                profile: profiles.find((p) => p.key === profile)?.text
            }))?.data,
            queryKey: ['summarizePaper', paperId, profile],
            staleTime: 1000 * 60 * 60 * 24,
            enabled: !!profile
        }
    );


    useEffect(() => {
        fetchPaper();
    }, []);


    const fetchPaper = async () => {
        try {
            const response = await axios.get(`/api/fetchPaper?paperId=${encodeURIComponent(paperId)}`);
            console.log('response:', response.data);
            // setPaper(response.data);
        } catch (error) {
            console.error('Error fetching paper:', error);
        }
    }

    
    const handleMouseDown = (e: React.MouseEvent) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 200) {
            setChatWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleShowArticle = async () => {
        try {
            setShowArticle(true);
            if (articleContent) {
                return;
            }
            setIsLoadingArticle(true);
            const response = await axios.post('/api/createArticle', {
                paper: summaryData?.summary,
                profile
            });
            setArticleContent(response.data);
        } catch (error) {
            console.error('Error generating article:', error);
        } finally {
            setIsLoadingArticle(false);
        }
    }

    const askQuestion = async () => {
        try {
            setQuestion('');
            const newConv = [...conversation, 'You: ' + question];
            setConversation(newConv);
            const response = await axios.post('/api/askQuestion', {
                source: summaryData?.source,
                profile: profiles.find((p) => p.key === profile)?.text,
                messages: conversation,
            });
            setConversation([...newConv, 'AI: ' + response.data.answer]);
        } catch (error) {
            console.error('Error asking question:', error);
        }
    }


    return (
        <div className="min-h-screen max-h-screen flex flex-col md:flex-row">
            <div className="flex-1 p-4 bg-gray-200 flex flex-col overflow-auto">
                <Link
                    className="bg-blue-500 text-white p-2 rounded w-16 flex items-center justify-center"
                    href="/"
                >
                    <FaArrowLeft />
                </Link>
                <div className="w-full flex flex-row gap-4 mt-4">
                     <div className="w-1/2 flex flex-col gap-4">
                        <h2 className="text-xl font-bold mb-1">Select Profile</h2>
                        <div className="flex flex-col items-start space-y-2">
                            {profiles.map((p) => (
                                <button
                                    key={p.key}
                                    className={`flex items-center space-x-2 p-2 w-full text-left rounded ${profile === p.key ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                    onClick={() => setProfile(p.key)}
                                >
                                    {p.icon && <p.icon />}
                                    <span>{p.label}</span>
                                </button>
                            ))}
                            {/* <button
                                className="flex items-center space-x-2 p-2 w-full text-left rounded bg-green-500 text-white"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaPlus />
                                <span>Create Profile</span>
                            </button> */}
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-4">
                        <h2 className="text-xl font-bold mb-1">Informations</h2>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold">Paper ID</h3>
                            <p>{paperId}</p>
                            <h3 className="text-lg font-bold mt-4">Profile</h3>
                            <p>{profiles.find((p) => p.key === profile)?.label}</p>
                        </div>
                        <button
                            className="bg-blue-500 text-white p-2 rounded w-full flex items-center justify-center gap-2"
                            onClick={() => {
                                handleShowArticle();

                            }}
                            disabled={isLoadingArticle}
                        >
                            <span>Generate Article</span>
                            {isLoadingSummary ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <FaNewspaper />
                            )}
                        </button>
                    </div>
                </div>
                <h2 className="text-xl font-bold mt-8 mb-4">Summary</h2>
                <div className="bg-white p-4 rounded shadow-md overflow-y-auto">
                    {summaryData?.summary && !isLoadingSummary && !isErrorSummary && (
                        <MdxRenderer content={summaryData.summary} />
                    )}
                    {isLoadingSummary && 
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    }
                </div>
            </div>
            <div className="max-w-full min-w-full relative md:min-w-[200px] flex flex-col p-4 bg-gray-100 " style={{ width: `${chatWidth}px` }} ref={chatRef}>
                <div className="display-none md:block absolute left-0 top-0 bottom-0 w-2 cursor-col-resize" ref={resizerRef} onMouseDown={handleMouseDown}></div>
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                <div className="flex-1 bg-white p-4 rounded shadow-md mb-4 overflow-y-auto max-h-96 md:max-h-full">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex flex-col gap-2 ${msg.startsWith('You') ? 'items-end' : 'items-start'}`}>
                            <div className={`flex gap-2 items-start ${msg.startsWith('You') ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`bg-blue-500 text-white p-2 rounded-full ${msg.startsWith('You') ? 'order-2' : 'order-1'}`}>
                                    {msg.startsWith('You') ? <FaUser /> : <FaRobot />}
                                </div>
                                <p><MdxRenderer content={msg} /></p>
                            </div>
                        </div>
                    ))}
                    
                </div>
                <div className="bg-white p-4 rounded shadow-md flex flex-row gap-4 items-start">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={askQuestion}
                        className="bg-green-500 text-white p-2 rounded w-16 flex items-center justify-center h-full"
                        disabled={isLoadingSummary}
                    >
                        {isLoadingSummary ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <FaPaperPlane width={32} height={32} />
                        )}
                    </button>
                    {answer && (
                        <div className="mt-4 bg-gray-50 p-4 rounded">
                            <h2 className="text-xl font-bold">Answer</h2>
                            <p>{answer}</p>
                        </div>
                    )}
                </div>
            </div>
            {showArticle && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg max-w-3xl max-h-3xl h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Article</h2>
                        {articleContent && (
                            <div className="flex flex-col gap-4">
                                <img src={articleContent.image} alt="Article Image" className="w-full h-48 object-cover rounded" />
                                <MdxRenderer content={articleContent.article} />
                            </div>
                        )}
                        {isLoadingArticle && 
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        }
                        <button
                            className="bg-blue-500 text-white p-2 rounded w-full mt-4 absolute top-4 right-4"
                            onClick={() => setShowArticle(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Summarize;
