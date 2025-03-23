import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Sparkles } from "lucide-react"
import { MotionCard, MotionCardContent, MotionCardHeader } from "@/components/motion/motion-card"
import { motion } from "framer-motion"
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-blue-950">
        <motion.div 
          className="absolute inset-0 opacity-15"
          animate={{ 
            background: [
              "radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 60%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 20%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.08) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Floating particles */}
      <motion.div 
        className="absolute w-32 h-32 rounded-full bg-blue-600/5 blur-3xl"
        animate={{ 
          x: ['-10%', '10%'],
          y: ['-5%', '5%'],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        style={{ top: '20%', left: '15%' }}
      />
      
      <motion.div 
        className="absolute w-40 h-40 rounded-full bg-violet-600/5 blur-3xl"
        animate={{ 
          x: ['5%', '-5%'],
          y: ['7%', '-7%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        style={{ bottom: '15%', right: '10%' }}
      />
      
      <motion.div 
        className="absolute w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl"
        animate={{ 
          x: ['-8%', '8%'],
          y: ['5%', '-5%'],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        style={{ top: '40%', right: '25%' }}
      />
      
      <MotionCard 
        className="w-full max-w-md backdrop-blur-sm bg-black/50 border border-white/5 shadow-2xl rounded-xl overflow-hidden z-10 mx-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <MotionCardHeader
          className="space-y-3 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center justify-center space-x-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
              curate.ai
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-center text-gray-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your personalized AI news curator
          </motion.p>
        </MotionCardHeader>
        
        <MotionCardContent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-600/30 text-red-200 px-4 py-3 rounded-lg mb-4 relative"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <motion.form 
                onSubmit={handleLoginSubmit} 
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="space-y-2"
                  variants={slideUp}
                >
                  <Label htmlFor="login-email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input 
                      id="login-email"
                      name="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 border-gray-700 bg-gray-800/50 focus:border-blue-500 focus:ring-violet-500 text-gray-200"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  variants={slideUp}
                >
                  <Label htmlFor="login-password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input 
                      id="login-password"
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 border-gray-700 bg-gray-800/50 focus:border-blue-500 focus:ring-violet-500 text-gray-200"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  className="pt-2"
                  variants={slideUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </TabsContent>
            
            <TabsContent value="signup">
              <motion.form 
                onSubmit={handleSignupSubmit} 
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="space-y-2"
                  variants={slideUp}
                >
                  <Label htmlFor="signup-name" className="text-gray-200">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input 
                      id="signup-name"
                      name="name"
                      type="text" 
                      placeholder="John Doe" 
                      className="pl-10 border-gray-700 bg-gray-800/50 focus:border-blue-500 focus:ring-violet-500 text-gray-200"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  variants={slideUp}
                >
                  <Label htmlFor="signup-email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input 
                      id="signup-email"
                      name="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 border-gray-700 bg-gray-800/50 focus:border-blue-500 focus:ring-violet-500 text-gray-200"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  variants={slideUp}
                >
                  <Label htmlFor="signup-password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                    <Input 
                      id="signup-password"
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 border-gray-700 bg-gray-800/50 focus:border-blue-500 focus:ring-violet-500 text-gray-200"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  {signupData.password && (
                    <motion.div 
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between text-xs mb-1 text-gray-300">
                        <span>Password strength: <span className={`font-semibold ${
                          passwordStrength.text === 'Strong' ? 'text-green-400' :
                          passwordStrength.text === 'Good' ? 'text-blue-400' :
                          passwordStrength.text === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{passwordStrength.text}</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-1.5 rounded-full ${passwordStrength.color}`} 
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                      <ul className="text-xs text-gray-400 mt-2 space-y-1.5 pl-2">
                        <li className={`transition-colors duration-300 ${signupData.password.length >= 8 ? "text-green-400" : ""}`}>
                          • At least 8 characters
                        </li>
                        <li className={`transition-colors duration-300 ${/[0-9]/.test(signupData.password) ? "text-green-400" : ""}`}>
                          • At least one number
                        </li>
                        <li className={`transition-colors duration-300 ${/[!@#$%^&*(),.?":{}|<>]/.test(signupData.password) ? "text-green-400" : ""}`}>
                          • At least one special character
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div
                  className="pt-2"
                  variants={slideUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </TabsContent>
          </Tabs>
        </MotionCardContent>
        
        <CardFooter className="flex flex-col space-y-2 pt-2 pb-4 text-center">
          <motion.div 
            className="text-center text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            By continuing, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
          </motion.div>
        </CardFooter>
      </MotionCard>
    </div>
  )
}

export default LoginSignup
