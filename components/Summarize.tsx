'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAstronaut, FaLaptopCode, FaUser, FaPlus, FaPaperPlane } from 'react-icons/fa';

interface Profile {
    id: number;
    name: string;
    level: string;
}

interface QnA {
    question: string;
    answer: string;
}

const Summarize = ({ paperId }: { paperId: string }) => {
    const paperText = "This study examines the effects of climate change on marine biodiversity over the past 50 years. Our findings indicate significant shifts in species distribution and ecosystem dynamics, driven by changing ocean temperatures and acidification. Climate change is one of the most pressing environmental issues of our time. It affects various natural systems, including marine ecosystems. This paper explores how rising temperatures and ocean acidification have altered marine biodiversity, focusing on specific case studies and global trends. Our primary research question is: How has marine biodiversity responded to climate change over the past half-century? We employed a combination of longitudinal data analysis, field experiments, and computer modeling to study changes in marine biodiversity. Data were collected from multiple sources, including historical records, satellite imagery, and in situ observations. Statistical methods were used to identify significant trends and correlations. Our findings indicate several significant impacts of climate change on marine biodiversity: (1) Species Distribution Shifts: Many marine species have migrated towards the poles in response to rising ocean temperatures, resulting in altered community structures in various marine ecosystems. (2) Ecosystem Dynamics Changes: Changes in the abundance of keystone species have disrupted predator-prey relationships, leading to new ecological equilibria. (3) Acidification Effects: Increased ocean acidification has adversely affected calcifying organisms, such as corals and shellfish, leading to declines in their populations. Our results highlight the profound impact of climate change on marine biodiversity. The poleward migration of species and changes in ecosystem dynamics pose challenges for conservation and management efforts. Future research should focus on developing adaptive strategies to mitigate these impacts. Limitations of our study include potential biases in historical data and the need for more comprehensive global monitoring systems. Climate change has significantly affected marine biodiversity, with far-reaching consequences for ecosystem health and human livelihoods. Immediate action is required to address these challenges and protect marine life."; // Replace with actual data
    const [profile, setProfile] = useState<string>('casual');
    const [summary, setSummary] = useState<string>('');
    const [qna, setQna] = useState<QnA[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [newProfileName, setNewProfileName] = useState<string>('');
    const [newProfileLevel, setNewProfileLevel] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const defaultProfiles: Profile[] = [
        { id: 1, name: 'Casual', level: 'casual' },
        { id: 2, name: 'Scientist', level: 'scientist' },
        { id: 3, name: 'Tech', level: 'tech' },
    ];

    useEffect(() => {
        const savedProfiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        setProfiles([...defaultProfiles, ...savedProfiles]);
        fetchProfiles();
    }, []);

    useEffect(() => {
        summarizePaper();
    }, [profile]);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('/api/userProfiles');
            setProfiles(response.data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const createProfile = () => {
        const newProfile = { id: Date.now(), name: newProfileName, level: newProfileLevel };
        const updatedProfiles = [...profiles, newProfile];
        setProfiles(updatedProfiles);
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        setNewProfileName('');
        setNewProfileLevel('');
        setIsModalOpen(false);
    };

    const summarizePaper = async () => {
        try {
            const response = await axios.post('/api/summarizePaper', {
                paper: {
                    title: 'The Impact of Climate Change on Marine Biodiversity',
                    text: paperText,
                },
                profile
            });
            console.log('response:', response.data);
            setSummary(response.data.summary);
            // setQna(response.data.qna);
        } catch (error) {
            console.error('Error summarizing paper:', error);
        }
    };

    const askQuestion = async () => {
        try {
            const response = await axios.post('/api/askQuestion', { paperText, question });
            setAnswer(response.data.answer);
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-1/2 p-4 bg-gray-200">
                <div className="w-full flex flex-row gap-4 mt-4">
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-4">Select Profile</h2>
                        <div className="flex flex-col items-start space-y-2">
                            {profiles.map((p) => (
                                <button
                                    key={p.id}
                                    className={`flex items-center space-x-2 p-2 w-full text-left rounded ${profile === p.level ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                    onClick={() => setProfile(p.level)}
                                >
                                    {p.level === 'scientist' && <FaUserAstronaut />}
                                    {p.level === 'tech' && <FaLaptopCode />}
                                    {p.level === 'casual' && <FaUser />}
                                    <span>{p.name}</span>
                                </button>
                            ))}
                            <button
                                className="flex items-center space-x-2 p-2 w-full text-left rounded bg-green-500 text-white"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaPlus />
                                <span>Create Profile</span>
                            </button>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-4">Informations</h2>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold">Paper ID</h3>
                            <p>{paperId}</p>
                            <h3 className="text-lg font-bold mt-4">Profile</h3>
                            <p>{profile}</p>
                        </div>
                    </div>
                </div>
                <h2 className="text-xl font-bold mt-8 mb-4">Summary</h2>
                <div className="bg-white p-4 rounded shadow-md">
                    {summary ? <p>{summary}</p> : <p>Loading...</p>}
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
                        onClick={askQuestion}
                        className="w-full bg-green-500 text-white p-2 rounded w-16 flex items-center justify-center h-full"
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
                        <button
                            onClick={createProfile}
                            className="w-full bg-purple-500 text-white p-2 rounded"
                        >
                            Create Profile
                        </button>
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
