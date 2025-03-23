import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User } from "lucide-react"
import { MotionCard, MotionCardContent, MotionCardHeader } from "@/components/motion/motion-card"
import { motion } from "framer-motion"
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const LoginSignup = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validation functions
  const validateLogin = (data) => {
    if (!data.email || !data.email.trim()) {
      toast.error('Email is required')
      return false
    }
    
    if (!data.password) {
      toast.error('Password is required')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const validateSignup = (data) => {
    if (!data.name || !data.name.trim()) {
      toast.error('Name is required')
      return false
    }
    
    if (!data.email || !data.email.trim()) {
      toast.error('Email is required')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    if (!data.password) {
      toast.error('Password is required')
      return false
    }
    
    if (data.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }
    
    // Check for at least one number and one special character
    const hasNumber = /\d/.test(data.password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
    
    if (!hasNumber || !hasSpecial) {
      toast.error('Password must contain at least one number and one special character')
      return false
    }
    
    return true
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateLogin(loginData)) {
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await login(loginData.email, loginData.password)
      if (result.success) {
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        toast.error(result.error || 'Login failed')
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateSignup(signupData)) {
      return
    }
    
    try {
      setIsLoading(true);
      const result = await register(signupData.name, signupData.email, signupData.password);
      
      if (result.success) {
        toast.success('Account created successfully!')
        // Redirect to interests selection page after successful registration
        navigate('/interests');
      } else {
        // Handle specific server error cases
        if (result.error?.includes('email already exists')) {
          toast.error('This email is already registered. Please login instead.')
        } else {
          toast.error(result.error || 'Registration failed')
        }
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong during signup')
      setError(error.message || 'Something went wrong during signup');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    let text = '';
    let color = '';
    
    switch(strength) {
      case 0:
      case 1:
        text = 'Weak';
        color = 'bg-red-500';
        break;
      case 2:
        text = 'Fair';
        color = 'bg-yellow-500';
        break;
      case 3:
        text = 'Good';
        color = 'bg-blue-500';
        break;
      case 4:
        text = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        text = '';
    }
    
    return { strength, text, color };
  }
  
  const passwordStrength = getPasswordStrength(signupData.password);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <MotionCard className="w-full max-w-md">
        <MotionCardHeader
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            Runtime Terrors
          </motion.h2>
          <motion.p 
            className="text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            Sign in to access your account
          </motion.p>
        </MotionCardHeader>
        <MotionCardContent>
          {/* Error messages now handled by toast, but keeping the error div
             for accessibility or if you want to display persistent errors */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
              {error}
            </div>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-email"
                      name="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="login-password"
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-name"
                      name="name"
                      type="text" 
                      placeholder="John Doe" 
                      className="pl-10"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email"
                      name="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-password"
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  {signupData.password && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Password strength: {passwordStrength.text}</span>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full">
                        <div 
                          className={`h-1 rounded-full ${passwordStrength.color}`} 
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <ul className="text-xs text-gray-500 mt-1 space-y-1">
                        <li className={signupData.password.length >= 8 ? "text-green-500" : ""}>
                          • At least 8 characters
                        </li>
                        <li className={/[0-9]/.test(signupData.password) ? "text-green-500" : ""}>
                          • At least one number
                        </li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(signupData.password) ? "text-green-500" : ""}>
                          • At least one special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </MotionCardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </MotionCard>
    </div>
  )
}

export default LoginSignup
