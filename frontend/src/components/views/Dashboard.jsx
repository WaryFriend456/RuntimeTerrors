import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";

export default function Dashboard() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <div className="container mx-auto py-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6">Your News Feed</h1>
            
            <Tabs defaultValue="foryou" className="mb-8">
                <TabsList className="mb-4">
                    <TabsTrigger value="foryou">For You</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="technology">Technology</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="science">Science</TabsTrigger>
                </TabsList>
                <TabsContent value="foryou">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(6).fill().map((_, i) => <NewsCardSkeleton key={i} />)
                        ) : (
                            news.map((item) => <NewsCard key={item.id} article={item} />)
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="following">
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">Content for Following tab</p>
                    </div>
                </TabsContent>
                <TabsContent value="technology">
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">Content for Technology tab</p>
                    </div>
                </TabsContent>
                <TabsContent value="business">
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">Content for Business tab</p>
                    </div>
                </TabsContent>
                <TabsContent value="science">
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">Content for Science tab</p>
                    </div>
                </TabsContent>
            </Tabs>

            <h2 className="text-xl font-bold mb-4">Top Stories</h2>
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    Array(3).fill().map((_, i) => <TopStoryCardSkeleton key={i} />)
                ) : (
                    news.slice(0, 3).map((item) => <TopStoryCard key={item.id} article={item} />)
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
                    {article.image && (
                        <div className="h-48 overflow-hidden">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center mb-2">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={article.source.logo} alt={article.source.name} />
                                <AvatarFallback>{article.source.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{article.source.name}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-grow">{article.description}</p>
                        <div className="flex justify-between items-center">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground">{article.readTime} min read</span>
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
                                <AvatarImage src={article.source.logo} alt={article.source.name} />
                                <AvatarFallback>{article.source.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{article.source.name}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                        <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground">{article.readTime} min read</span>
                        </div>
                    </div>
                    {article.image && (
                        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover rounded-md"
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
                <Skeleton className="h-48 w-full" />
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

// Mock data
const mockNews = [
    {
        id: 1,
        title: "New AI breakthrough helps machines understand context better",
        description: "Researchers have developed a new approach that improves how AI systems understand and respond to complex contexts in human language.",
        image: "https://images.unsplash.com/photo-1677442135136-760c813029fb?q=80&w=2676&auto=format&fit=crop",
        category: "Technology",
        readTime: 4,
        publishedAt: "2h ago",
        source: {
            name: "TechDaily",
            logo: "https://ui-avatars.com/api/?name=TD&background=random"
        }
    },
    {
        id: 2,
        title: "Global markets respond to economic growth forecasts",
        description: "Markets surged today following the release of better-than-expected economic growth forecasts for major economies.",
        image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2670&auto=format&fit=crop",
        category: "Business",
        readTime: 5,
        publishedAt: "4h ago",
        source: {
            name: "Financial Times",
            logo: "https://ui-avatars.com/api/?name=FT&background=random"
        }
    },
    {
        id: 3,
        title: "Scientists discover potential treatment for rare genetic disorder",
        description: "A team of researchers has identified a promising new treatment approach for a rare genetic disorder that affects thousands worldwide.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2670&auto=format&fit=crop",
        category: "Health",
        readTime: 6,
        publishedAt: "6h ago",
        source: {
            name: "Science Today",
            logo: "https://ui-avatars.com/api/?name=ST&background=random"
        }
    },
    {
        id: 4,
        title: "Electric vehicle adoption accelerates in urban centers",
        description: "Major cities are seeing rapid growth in electric vehicle usage as charging infrastructure expands and prices become more competitive.",
        image: "https://images.unsplash.com/photo-1593941707882-a56bbc8df8e9?q=80&w=2672&auto=format&fit=crop",
        category: "Environment",
        readTime: 3,
        publishedAt: "8h ago",
        source: {
            name: "GreenReport",
            logo: "https://ui-avatars.com/api/?name=GR&background=random"
        }
    },
    {
        id: 5,
        title: "New space telescope reveals distant galaxies in unprecedented detail",
        description: "Astronomers are celebrating as the first images from a new space telescope show previously unseen details of distant galaxies.",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2827&auto=format&fit=crop",
        category: "Science",
        readTime: 7,
        publishedAt: "Yesterday",
        source: {
            name: "Cosmos",
            logo: "https://ui-avatars.com/api/?name=C&background=random"
        }
    },
    {
        id: 6,
        title: "Advanced robotics changing manufacturing landscape",
        description: "New developments in robotics technology are transforming manufacturing processes and raising questions about workforce adaptation.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop",
        category: "Technology",
        readTime: 5,
        publishedAt: "Yesterday",
        source: {
            name: "TechDaily",
            logo: "https://ui-avatars.com/api/?name=TD&background=random"
        }
    }
];