import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { 
            role: "system", 
            content: "Hello! I'm your news assistant. Ask me about any topic and I'll find relevant news and summarize it for you."
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // If user is not authenticated, redirect to login
    useEffect(() => {
        if (!user || !token) {
            navigate("/login");
        }
    }, [user, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };

        // Update messages with user input
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Add a "thinking" message
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Thinking...", isTemporary: true }
        ]);

        // Delay processing by 5 seconds
        setTimeout(async () => {
            try {
                // Remove the temporary "thinking" message
                setMessages((prev) => prev.filter(msg => !msg.isTemporary));
                
                // Call backend API for all queries
                const response = await axios.post(
                    "/api/chatbot/query",
                    { query: userMessage.content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Add AI response to messages
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: response.data.summary }
                ]);
            } catch (error) {
                console.error("Error processing query:", error);
                setMessages((prev) => [
                    ...prev.filter(msg => !msg.isTemporary),
                    {
                        role: "assistant",
                        content: "Sorry, I encountered an error processing your request. Please try again later."
                    }
                ]);
            } finally {
                setLoading(false);
            }
        }, 5000); // 5 second delay
    };

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <Card className="h-[80vh] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>News Explorer</span>
                        <Button variant="outline" onClick={() => navigate("/dashboard")}>
                            Back to Dashboard
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`flex gap-2 max-w-[80%] ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        } p-3 rounded-lg`}
                                    >
                                        {message.role !== "user" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSubmit} className="flex w-full gap-2">
                        <Input
                            placeholder="Ask me about any news topic..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-grow"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
