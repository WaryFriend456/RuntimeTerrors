import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Newspaper, Zap, UserCheck, FileText, Globe, Shield } from "lucide-react";

const About = () => {
    const teamMembers = [
        {
            name: "Jane Doe",
            role: "Co-Founder & AI Specialist",
            avatar: "https://github.com/shadcn.png",
            bio: "Jane has over 10 years of experience in machine learning and natural language processing systems."
        },
        {
            name: "John Smith",
            role: "Co-Founder & CTO",
            avatar: "https://github.com/shadcn.png", 
            bio: "John brings expertise in building scalable systems for content aggregation and personalization."
        },
        {
            name: "Emily Johnson",
            role: "Lead UX Designer",
            avatar: "https://github.com/shadcn.png",
            bio: "Emily creates intuitive interfaces that make personalized news consumption seamless and enjoyable."
        },
        {
            name: "Michael Brown",
            role: "Senior ML Engineer",
            avatar: "https://github.com/shadcn.png",
            bio: "Michael specializes in recommendation algorithms and content classification systems."
        }
    ];

    const features = [
        {
            title: "AI-Powered Curation",
            description: "Our advanced algorithms analyze multiple news sources and generate concise summaries tailored to your interests.",
            icon: <Zap className="h-8 w-8 text-blue-500" />
        },
        {
            title: "Personalized Experience",
            description: "Content is curated based on your reading habits, preferences, and feedback to create a truly personalized news feed.",
            icon: <UserCheck className="h-8 w-8 text-indigo-500" />
        },
        {
            title: "Multi-Source Aggregation",
            description: "We collect information from diverse news sources to provide balanced and comprehensive coverage.",
            icon: <Globe className="h-8 w-8 text-purple-500" />
        },
        {
            title: "Smart Summaries",
            description: "Get the essential information without the noise through AI-generated summaries that capture the key points.",
            icon: <FileText className="h-8 w-8 text-violet-500" />
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">About Us</Badge>
                <h1 className="text-4xl font-bold tracking-tight mb-4">curateAI</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Your personalized AI-powered news curator, delivering tailored content from multiple sources in one place.
                </p>
            </div>

            <Card className="mb-16 border-blue-900/20 bg-blue-950/5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Newspaper className="mr-2 h-6 w-6 text-blue-500" />
                        Our Mission
                    </CardTitle>
                    <CardDescription>Revolutionizing how you consume news</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <p className="text-muted-foreground">
                        At curateAI, we're on a mission to solve the problem of information overload and news fatigue. 
                        We believe everyone deserves access to news that's relevant, balanced, and easy to digest.
                    </p>
                    <p className="text-muted-foreground">
                        Our AI-powered platform curates and generates personalized news summaries from multiple sources, 
                        tailored to your specific interests and preferences. We're building a future where staying informed 
                        doesn't mean spending hours scrolling through headlines.
                    </p>
                </CardContent>
            </Card>

            <h2 className="text-3xl font-bold text-center mb-8">How curateAI Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {features.map((feature, index) => (
                    <Card key={index} className="overflow-hidden border-blue-900/20 bg-blue-950/5">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {teamMembers.map((member, index) => (
                    <Card key={index} className="overflow-hidden border-blue-900/20 bg-blue-950/5">
                        <div className="flex flex-col sm:flex-row">
                            <div className="p-6 flex items-center justify-center sm:justify-start">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <Badge variant="secondary" className="mt-1 mb-2">{member.role}</Badge>
                                <p className="text-muted-foreground">{member.bio}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="border-blue-900/20 bg-blue-950/5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-6 w-6 text-blue-500" />
                        Our Commitment
                    </CardTitle>
                    <CardDescription>Responsible news curation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <p className="mb-4 text-muted-foreground">
                            We're committed to fighting misinformation and filter bubbles. Our platform is designed to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Present diverse viewpoints on important topics</li>
                            <li>Clearly distinguish between facts and opinions</li>
                            <li>Provide source transparency for all generated summaries</li>
                            <li>Respect user privacy and data security</li>
                        </ul>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2">Get In Touch</h4>
                            <p className="mb-4 text-muted-foreground">
                                Have questions or feedback about your news experience? We'd love to hear from you.
                            </p>
                            <p className="font-medium">Email: contact@curateai.com</p>
                            <p className="font-medium">Support: support@curateai.com</p>
                        </div>
                        <Separator orientation="vertical" className="hidden md:block h-24" />
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-blue-400 transition-colors">Twitter</a>
                                <a href="#" className="text-muted-foreground hover:text-blue-400 transition-colors">LinkedIn</a>
                                <a href="#" className="text-muted-foreground hover:text-blue-400 transition-colors">Medium</a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default About;