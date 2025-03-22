import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import React from "react"

interface MotionCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const MotionCard = ({ children, className = "", delay = 0 }: MotionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: delay,
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  )
}

// Also export wrapped versions of Card subcomponents for convenience
const MotionCardHeader = motion(CardHeader)
const MotionCardContent = motion(CardContent)
const MotionCardFooter = motion(CardFooter)

export { MotionCard, MotionCardHeader, MotionCardContent, MotionCardFooter }
