import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CalendarIcon, SettingsIcon, UserIcon, BookmarkIcon, LogOutIcon, NewspaperIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout, updateUserInterests, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [isUpdatingInterests, setIsUpdatingInterests] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [readingHistory, setReadingHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);

    // Available interest categories
    const availableInterests = [
        'Technology', 'Business', 'Science', 'Health', 
        'Politics', 'Entertainment', 'Sports', 'World'
    ];

    // Initialize selected interests from user data and handle loading state
    useEffect(() => {
        // If auth context is no longer loading and we have user data
        if (!loading) {
            if (user && user.interests) {
                setSelectedInterests(user.interests);
            }
            setLocalLoading(false);
            
            // If auth is done loading but we don't have a user, redirect to login
            if (!user && !loading) {
                navigate('/login');
            }
        }
    }, [user, loading, navigate]);

    // Check if we arrived from login/register and need to fetch data
    useEffect(() => {
        const fromAuth = location.state?.fromAuth;
        if (fromAuth && token) {
            // Force a reload to ensure all user data is properly loaded
            window.location.reload();
        }
    }, [location, token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInterestChange = (interest) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            } else {
                return [...prev, interest];
            }
        });
    };

    const handleInterestsSubmit = async () => {
        if (selectedInterests.length === 0) {
            toast.error('Please select at least one interest');
            return;
        }
        
        try {
            setIsUpdatingInterests(true);
            await updateUserInterests(selectedInterests);
            toast.success('Your interests have been updated successfully!');
        } catch (error) {
            toast.error('Failed to update interests. Please try again.');
            console.error('Interest update error:', error);
        } finally {
            setIsUpdatingInterests(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Improved loading state check
    if (loading || localLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
                <p className="text-lg mb-4">Session expired or not logged in</p>
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <motion.div 
                className="mb-8 bg-card rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Banner and profile info */}
                <div className="h-40 bg-gradient-to-r from-blue-800 to-violet-800"></div>
                <div className="relative px-6 pb-6">
                    <div className="absolute -top-16 left-6">
                        <Avatar className="border-4 border-background w-32 h-32 bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                            <AvatarFallback className="text-3xl font-bold text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    
                    <div className="pt-20 md:pt-0 md:ml-40">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                        
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            <span>Member since {formatDate(user.createdAt || new Date())}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="secondary" className="bg-blue-600/10 text-blue-600 dark:text-blue-400">News Reader</Badge>
                            {user.interests && user.interests.map(interest => (
                                <Badge key={interest} variant="outline">{interest}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Tabs section */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="interests">My Interests</TabsTrigger>
                    <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <NewspaperIcon className="h-5 w-5 text-blue-500" />
                                    Your News Profile
                                </CardTitle>
                                <CardDescription>Your personalized news preferences and activity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Your Interests</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {user.interests && user.interests.length > 0 ? (
                                                user.interests.map(interest => (
                                                    <Badge key={interest}>{interest}</Badge>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-sm">No interests selected yet. Add some to personalize your news feed!</p>
                                            )}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setActiveTab("interests")}
                                        >
                                            Update Interests
                                        </Button>
                                    </div>
                                    
                                    <div className="pt-4 border-t">
                                        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                                        <div className="text-center py-8 text-muted-foreground">
                                            <BookmarkIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                            <p>Your recent reading activity will appear here</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
                
                <TabsContent value="interests">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Your Interests</CardTitle>
                                <CardDescription>Select categories to personalize your news feed</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                    {availableInterests.map((interest) => (
                                        <div key={interest} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`interest-${interest}`}
                                                checked={selectedInterests.includes(interest)}
                                                onCheckedChange={() => handleInterestChange(interest)}
                                            />
                                            <Label 
                                                htmlFor={`interest-${interest}`}
                                                className="cursor-pointer"
                                            >
                                                {interest}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-6">
                                    Selecting your interests helps us curate news articles that match your preferences. 
                                    You can change these anytime.
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSelectedInterests(user.interests || [])}
                                    disabled={isUpdatingInterests}
                                >
                                    Reset
                                </Button>
                                <Button 
                                    onClick={handleInterestsSubmit}
                                    disabled={isUpdatingInterests || selectedInterests.length === 0}
                                >
                                    {isUpdatingInterests ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : 'Save Interests'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </TabsContent>
                
                <TabsContent value="settings">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>Manage your account preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-base">Email</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-muted rounded text-sm flex-grow">
                                            {user.email}
                                        </div>
                                        <Button variant="outline" size="sm" disabled>Change</Button>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <Label className="text-base">Password</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-muted rounded text-sm flex-grow">
                                            ••••••••
                                        </div>
                                        <Button variant="outline" size="sm" disabled>Change</Button>
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t mt-6">
                                    <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        These actions cannot be undone. Please be certain.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            disabled
                                        >
                                            Delete Account
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-destructive border-destructive/30"
                                            onClick={handleLogout}
                                        >
                                            <LogOutIcon className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}