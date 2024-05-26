'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAstronaut, FaLaptopCode, FaUser, FaPlus, FaPaperPlane, FaChild } from 'react-icons/fa';
import MdxRenderer from './MdxRenderer';
import { IconType } from 'react-icons';

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
    const [summary, setSummary] = useState<string>('');
    const [qna, setQna] = useState<QnA[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
    const [newProfileName, setNewProfileName] = useState<string>('');
    const [newProfileLevel, setNewProfileLevel] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    useEffect(() => {
        // const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        // setProfiles([...defaultProfiles, ...savedProfiles]);
        // fetchProfiles();
        fetchPaper();
    }, []);

    useEffect(() => {
        summarizePaper();
    }, [profile]);


    const fetchPaper = async () => {
        try {
            const response = await axios.get(`/api/fetchPaper?paperId=${encodeURIComponent(paperId)}`);
            console.log('response:', response.data);
            // setPaper(response.data);
        } catch (error) {
            console.error('Error fetching paper:', error);
        }
    }
    

    // const createProfile = () => {
    //     const newProfile = { id: Date.now(), name: newProfileName, level: newProfileLevel };
    //     const updatedProfiles = [...profiles, newProfile];
    //     setProfiles(updatedProfiles);
    //     localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    //     setNewProfileName('');
    //     setNewProfileLevel('');
    //     setIsModalOpen(false);
    // };

    const summarizePaper = async () => {
        try {
            const response = await axios.post('/api/summarizePaper', {
                paperId,
                profile: profiles.find((p) => p.key === profile)?.text
            });
            console.log('response:', response.data);
            setSummary(response.data.summary);
            // setQna(response.data.qna);
        } catch (error) {
            console.error('Error summarizing paper:', error);
        }
    };

    // const askQuestion = async () => {
    //     try {
    //         const response = await axios.post('/api/askQuestion', { paperText, question });
    //         setAnswer(response.data.answer);
    //     } catch (error) {
    //         console.error('Error asking question:', error);
    //     }
    // };

    return (
        <div className="min-h-screen max-h-screen flex">
            <div className="w-1/2 p-4 bg-gray-200">
                <div className="w-full flex flex-row gap-4 mt-4">
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-4">Select Profile</h2>
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
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-4">Informations</h2>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold">Paper ID</h3>
                            <p>{paperId}</p>
                            <h3 className="text-lg font-bold mt-4">Profile</h3>
                            <p>{profiles.find((p) => p.key === profile)?.label}</p>
                        </div>
                    </div>
                </div>
                <h2 className="text-xl font-bold mt-8 mb-4">Summary</h2>
                <div className="bg-white p-4 rounded shadow-md overflow-y-auto">
                    {summary ? <MdxRenderer content={summary} /> : <p>Loading...</p>}
                </div>
            </div>
            <div className="w-1/2 flex flex-col p-4 bg-gray-100">
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                <div className="flex-1 bg-white p-4 rounded shadow-md mb-4 overflow-y-auto">
                    {qna.map((q, index) => (
                        <div key={index} className="mb-4">
                            <p><strong>Q:</strong> {q.question}</p>
                            <p><strong>A:</strong> {q.answer}</p>
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
                        // onClick={askQuestion}
                        className="bg-green-500 text-white p-2 rounded w-16 flex items-center justify-center h-full"
                    >
                        <FaPaperPlane width={32} height={32} />
                    </button>
                    {answer && (
                        <div className="mt-4 bg-gray-50 p-4 rounded">
                            <h2 className="text-xl font-bold">Answer</h2>
                            <p>{answer}</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Create Profile</h2>
                        <input
                            type="text"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            placeholder="Profile Name"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            value={newProfileLevel}
                            onChange={(e) => setNewProfileLevel(e.target.value)}
                            placeholder="Profile Level"
                            className="w-full p-2 border rounded mb-4"
                        />
                        {/* <button
                            onClick={createProfile}
                            className="w-full bg-purple-500 text-white p-2 rounded"
                        >
                            Create Profile
                        </button> */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full bg-gray-500 text-white p-2 rounded mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Summarize;
