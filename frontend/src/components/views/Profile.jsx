import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SettingsIcon, UserIcon, BookmarkIcon, LogOutIcon, PencilIcon } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Mock user data - replace with actual user data from your state management or API
    const user = {
        name: "Alice Johnson",
        username: "@alice_johnson",
        bio: "Full-stack developer | Open source contributor | Coffee enthusiast",
        avatarUrl: "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice",
        joinDate: "January 2023",
        location: "San Francisco, CA",
        followers: 1243,
        following: 567,
        projects: 42
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="mb-8 bg-card rounded-xl overflow-hidden shadow-lg">
                {/* Banner and profile info */}
                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="relative px-6 pb-6">
                    <Avatar className="absolute -top-16 border-4 border-background w-32 h-32">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex justify-end mt-4 mb-6">
                        <Button variant="outline" size="sm" className="mr-2">
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Button variant="outline" size="sm">
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                    
                    <div className="mt-8">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.username}</p>
                        <p className="mt-2">{user.bio}</p>
                        
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                            <UserIcon className="mr-1 h-4 w-4" />
                            <span className="mr-4">{user.followers} followers · {user.following} following</span>
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            <span>Joined {user.joinDate}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                            <Badge variant="secondary">{user.location}</Badge>
                            <Badge variant="secondary">Developer</Badge>
                            <Badge variant="secondary">Open to work</Badge>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Tabs section */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                I'm a full-stack developer with 5 years of experience building web applications.
                                My primary focus is on React, Node.js, and cloud infrastructure. I enjoy 
                                contributing to open-source projects and mentoring junior developers.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Skills</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        <Badge>JavaScript</Badge>
                                        <Badge>React</Badge>
                                        <Badge>Node.js</Badge>
                                        <Badge>TypeScript</Badge>
                                        <Badge>AWS</Badge>
                                        <Badge>GraphQL</Badge>
                                        <Badge>Tailwind CSS</Badge>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Projects</span>
                                                <span className="font-medium">{user.projects}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Contributions</span>
                                                <span className="font-medium">328</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Repositories</span>
                                                <span className="font-medium">64</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your last 3 activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Updated profile README</span>
                                            <span className="text-sm text-muted-foreground">2 days ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Added new project information and skills section
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" className="w-full">
                                View all activity
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-4">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold">Projects ({user.projects})</h2>
                        <Button>New Project</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700"></div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Project {i}</CardTitle>
                                    <CardDescription>A brief description of this project</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>Last updated 2 weeks ago</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="ghost" size="sm">View</Button>
                                    <Button variant="outline" size="sm">
                                        <BookmarkIcon className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Your recent activities across projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex gap-4 border-b pb-6 last:border-0">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-baseline">
                                                <h4 className="font-semibold mr-2">Activity {i}</h4>
                                                <span className="text-sm text-muted-foreground">{i} day{i !== 1 ? 's' : ''} ago</span>
                                            </div>
                                            <p className="mt-1">Made updates to the project documentation and fixed several bugs in the UI components.</p>
                                            <div className="mt-2">
                                                <Badge variant="outline">Project {i}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Load More</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="saved">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saved Items</CardTitle>
                            <CardDescription>Projects and posts you've bookmarked</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-muted-foreground">
                                <BookmarkIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No saved items yet</h3>
                                <p>Bookmarks you add will appear here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {/* Account actions */}
            <div className="mt-12 flex justify-end">
                <Button variant="outline" size="sm" className="text-destructive">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}