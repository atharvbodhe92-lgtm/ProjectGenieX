import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getRecentResearchPaperRecommendationSessions,
    saveResearchPaperRecommendationSession,
} from "@/services/projectService";
import axios from "axios";
import { useEffect, useState } from "react";
import { ExternalLink } from "react-external-link";
import { useSelector } from "react-redux";

const ResearchPaperRecommend = ({ initialTitle = "" }) =>
{
    const [info, setInfo] = useState([]);
    const [title, setTitle] = useState(initialTitle);
    const [recentPaperSessions, setRecentPaperSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchRecentPaperSessions = async () => {
            if (!user?.uid) return;

            const sessions = await getRecentResearchPaperRecommendationSessions(user.uid);
            setRecentPaperSessions(sessions);
        };

        fetchRecentPaperSessions();
    }, [user?.uid]);

    useEffect(() => {
        setTitle(initialTitle || "");
    }, [initialTitle]);

const fetchResearchPaper = async () =>
    {
        if (!title.trim()) return alert("Please enter a project title.");

        setLoading(true);

        try {
            const response = await axios.get("/api/v1/research-papers", {
                params: { query: title },
            });

            if (response.status === 200) {
                const papers = response.data.scholar_results || [];
                setInfo(papers);

                if (user?.uid) {
                    const sessionId = await saveResearchPaperRecommendationSession(user.uid, title.trim(), papers);
                    if (sessionId) {
                        setRecentPaperSessions((prev) => [
                            {
                                id: sessionId,
                                projectTitle: title.trim(),
                                papers,
                            },
                            ...prev,
                        ].slice(0, 5));
                    }
                }
            } else {
                console.log("Request failed with status code:", response.status);
            }
        } catch (error) {
            console.error("Error fetching research papers:", error.message);
        }

        setLoading(false);
    };

    return (
        <>
            <div className="m-10">
                <h2 className="text-xl my-3 font-medium">Enter Project Title:</h2>
                <Input
                    type="text"
                    value={title}
                    placeholder="Enter your project title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <div className="text-right">
                    <Button
                        disabled={loading}
                        onClick={fetchResearchPaper}
                        className="bg-[#4845D2] hover:bg-[#4745d2af]"
                    >
                        {loading ? (
                            <i className="ri-loader-4-line animate-spin" />
                        ) : (
                            "Fetch Resources"
                        )}
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                {info.length > 0 ? (
                    info.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white border-2 border-black p-4 rounded-md drop-shadow-xl mb-4 text-wrap"
                        >
                            <ExternalLink href={value.title_link}>
                                <p className="text-blue-600 underline hover:text-blue-800">
                                    {value.title}
                                </p>
                            </ExternalLink>
                            {value.snippet && (
                                <p className="text-sm text-gray-600 mt-2">{value.snippet}</p>
                            )}
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-center text-gray-600">No results yet.</p>
                )}
            </div>

            {recentPaperSessions.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-xl font-bold mb-3">Recent Paper Research</h3>
                    <div className="space-y-3">
                        {recentPaperSessions.map((session) => (
                            <div key={session.id} className="border rounded-md p-4 bg-white">
                                <p className="text-sm font-semibold">{session.projectTitle}</p>
                                <div className="mt-2 space-y-2">
                                    {session.papers?.slice(0, 3).map((paper, index) => (
                                        <ExternalLink key={`${session.id}-${index}`} href={paper.title_link}>
                                            <p className="text-sm text-blue-600 underline hover:text-blue-800">
                                                {paper.title}
                                            </p>
                                        </ExternalLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ResearchPaperRecommend;
