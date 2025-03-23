import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { toast } from "sonner";

export default function Dashboard() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("foryou");
    const { user, token } = useAuth();
    
    // Get interests directly from user object, with fallback to defaults
    const userInterests = user?.interests || [];
    const hasUserInterests = userInterests.length > 0;
    const defaultInterests = ['technology', 'business', 'science'];
    
    // Use user interests if available, otherwise use defaults
    const interests = hasUserInterests ? userInterests : defaultInterests;

    // Function to fetch articles
    const fetchArticles = async () => {
        try {
            setLoading(true);

            // Refresh articles - this will fetch new ones and store in DB
            const refreshResponse = await axios.post('/api/articles/refresh', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (refreshResponse.data && refreshResponse.data.articles) {
                setNews(refreshResponse.data.articles);
            } else {
                // If no articles returned in refresh, fetch existing ones
                const articlesResponse = await axios.get('/api/articles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (articlesResponse.data && articlesResponse.data.length) {
                    setNews(articlesResponse.data);
                } else {
                    if (!hasUserInterests) {
                        toast.info("No interests set. Please update your interests in your profile.");
                    } else {
                        toast.info("No articles found. Try adding more interests!");
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
            toast.error("Failed to load articles. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchArticles();
        }
    }, [user, token]); // Re-fetch when user or token changes

    // If user doesn't have interests, prompt them to add some
    useEffect(() => {
        if (user && !hasUserInterests) {
            toast.info("Set up your interests for a personalized news feed", {
                action: {
                    label: "Add Interests",
                    onClick: () => navigate("/interests")
                }
            });
        }
    }, [user]);

    // Filter articles based on active tab
    const getFilteredArticles = () => {
        if (activeTab === "foryou") {
            return news; // Show all articles in "For You" tab
        } else {
            return news.filter(article => article.interest.toLowerCase() === activeTab.toLowerCase());
        }
    };

    const filteredArticles = getFilteredArticles();

    // Format the date 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? "Recent" : date.toLocaleDateString();
    };

    return (
        <div className="container mx-auto py-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Your News Feed</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-4 overflow-x-auto flex whitespace-nowrap">
                    <TabsTrigger value="foryou">For You</TabsTrigger>
                    {interests.map(interest => (
                        <TabsTrigger key={interest} value={interest.toLowerCase()}>
                            {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeTab}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(6).fill().map((_, i) => <NewsCardSkeleton key={i} />)
                        ) : filteredArticles.length > 0 ? (
                            filteredArticles.map((item, index) => (
                                <NewsCard 
                                    key={index} 
                                    article={{
                                        ...item,
                                        publishedAt: formatDate(item.publishedAt)
                                    }} 
                                />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-10">
                                <p className="text-muted-foreground">No articles found for this category.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <h2 className="text-xl font-bold mb-4">Top Stories</h2>
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    Array(3).fill().map((_, i) => <TopStoryCardSkeleton key={i} />)
                ) : news.length > 0 ? (
                    news.slice(0, 3).map((item, index) => (
                        <TopStoryCard 
                            key={index} 
                            article={{
                                ...item,
                                publishedAt: formatDate(item.publishedAt)
                            }} 
                        />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No top stories available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function NewsCard({ article }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <div className="flex flex-col h-full">
                    {article.imageUrl && (
                        <div className="aspect-video relative overflow-hidden">
                            <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover absolute inset-0"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/640x360?text=No+Image";
                                }}
                            />
                        </div>
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center mb-2">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{article.source.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{article.source}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">
                            {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex justify-between items-center">
                            <Badge variant="outline">{article.interest}</Badge>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Read more
                            </a>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TopStoryCard({ article }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{article.source.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{article.source}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {article.content.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline">{article.interest}</Badge>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Read more
                            </a>
                        </div>
                    </div>
                    {article.imageUrl && (
                        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative rounded-md overflow-hidden">
                            <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-full object-cover absolute inset-0"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                }}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function NewsCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                    <div className="flex items-center mb-2">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TopStoryCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            <Skeleton className="h-6 w-6 rounded-full mr-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                    <Skeleton className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}