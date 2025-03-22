import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const About = () => {
    const teamMembers = [
        {
            name: "Jane Doe",
            role: "Co-Founder & CEO",
            avatar: "https://github.com/shadcn.png",
            bio: "Jane has over 10 years of experience in software development and leadership."
        },
        {
            name: "John Smith",
            role: "Co-Founder & CTO",
            avatar: "https://github.com/shadcn.png", 
            bio: "John brings expertise in architecture and scalable systems development."
        },
        {
            name: "Emily Johnson",
            role: "Lead Designer",
            avatar: "https://github.com/shadcn.png",
            bio: "Emily creates beautiful, intuitive interfaces that delight our users."
        },
        {
            name: "Michael Brown",
            role: "Senior Developer",
            avatar: "https://github.com/shadcn.png",
            bio: "Michael is passionate about clean code and building robust applications."
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">About Us</Badge>
                <h1 className="text-4xl font-bold tracking-tight mb-4">Runtime Terrors</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    We're a dedicated team of developers and designers building innovative solutions 
                    to help businesses thrive in the digital world.
                </p>
            </div>

            <Card className="mb-16">
                <CardHeader>
                    <CardTitle>Our Mission</CardTitle>
                    <CardDescription>What drives us every day</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <p className="text-muted-foreground">
                        At Runtime Terrors, we're passionate about creating exceptional software solutions 
                        that solve real-world problems. We believe in clean code, thoughtful design, and 
                        putting users first in everything we build.
                    </p>
                    <p className="text-muted-foreground">
                        Our team combines technical excellence with creative problem-solving to deliver 
                        applications that not only meet requirements but exceed expectations.
                    </p>
                </CardContent>
            </Card>

            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {teamMembers.map((member, index) => (
                    <Card key={index} className="overflow-hidden">
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

            <Card>
                <CardHeader>
                    <CardTitle>Get In Touch</CardTitle>
                    <CardDescription>We'd love to hear from you</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex-1">
                            <p className="mb-4 text-muted-foreground">
                                Have a question or want to work with us? Reach out and we'll get back to you as soon as possible.
                            </p>
                            <p className="font-medium">Email: contact@runtimeterrors.com</p>
                            <p className="font-medium">Location: San Francisco, CA</p>
                        </div>
                        <Separator orientation="vertical" className="hidden md:block h-24" />
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default About;