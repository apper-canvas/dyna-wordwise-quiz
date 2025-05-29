import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <ApperIcon name="BookX" className="w-24 h-24 mx-auto text-surface-400 dark:text-surface-600" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-surface-800 dark:text-surface-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Looks like this page got lost in the vocabulary! Let's get you back to the quiz.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to Quiz</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound