import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from 'framer-motion';
import { Home, BookOpen, UserCircle, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
      isScrolled ? 'shadow-sm bg-background/95' : 'bg-background/70'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">cA</span>
            </div> */}
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              curate.ai
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <div className="w-px h-6 bg-border mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <Link to="/profile" className="ml-1">
                  <Avatar className="h-8 w-8 transition-all hover:shadow-md border-2 border-transparent hover:border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <>
                <Link to="/about">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    About
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="default" size="sm" className="ml-2 shadow-sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 border-t py-3"
          >
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2 border rounded-md mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-600 text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/about" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <BookOpen className="h-4 w-4" />
                      About
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full mt-2"
                    >
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
