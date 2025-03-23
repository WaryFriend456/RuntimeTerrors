import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const interests = [
  'India', 'Business', 'Politics', 'Sports', 
  'Technology', 'Startups', 'Entertainment', 'International'
]

const UserInterests = () => {
  const [selectedInterests, setSelectedInterests] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateUserInterests } = useAuth()
  const navigate = useNavigate()

  const handleInterestChange = (interest) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest)
      } else {
        return [...prev, interest]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest')
      return
    }
    
    try {
      setIsSubmitting(true)
      const result = await updateUserInterests(selectedInterests)
      toast.success('Interests saved successfully!')
      navigate('/dashboard', { replace: true }) // Added replace:true for a cleaner navigation history
      // navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save interests')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Select Your Interests</CardTitle>
          <CardDescription>
            Choose news categories you're interested in. We'll personalize your news feed accordingly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest) => (
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
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Interests'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInterests
