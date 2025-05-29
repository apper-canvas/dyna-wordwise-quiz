import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const QUIZ_DATA = [
  {
    id: 1,
    question: "What does 'ubiquitous' mean?",
    options: ["Existing everywhere", "Very rare", "Extremely large", "Completely silent"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "definitions"
  },
  {
    id: 2,
    question: "Which word is a synonym for 'ephemeral'?",
    options: ["Permanent", "Temporary", "Ancient", "Modern"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "synonyms"
  },
  {
    id: 3,
    question: "What is the antonym of 'verbose'?",
    options: ["Talkative", "Lengthy", "Concise", "Detailed"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "antonyms"
  },
  {
    id: 4,
    question: "What does 'serendipity' mean?",
    options: ["Bad luck", "A pleasant surprise", "Hard work", "Deep thought"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "definitions"
  },
  {
    id: 5,
    question: "Which word means 'having mixed feelings'?",
    options: ["Ecstatic", "Ambivalent", "Confident", "Indifferent"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "definitions"
  },
  {
    id: 6,
    question: "What is a synonym for 'meticulous'?",
    options: ["Careless", "Careful", "Quick", "Lazy"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "synonyms"
  },
  {
    id: 7,
    question: "What does 'cacophony' refer to?",
    options: ["Beautiful music", "Harsh sounds", "Complete silence", "Soft whispers"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "definitions"
  },
  {
    id: 8,
    question: "Which word is the opposite of 'zenith'?",
    options: ["Peak", "Summit", "Nadir", "Height"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "antonyms"
  }
]

const DIFFICULTY_COLORS = {
  easy: "from-green-500 to-emerald-500",
  medium: "from-yellow-500 to-orange-500",
  hard: "from-red-500 to-pink-500"
}

const CATEGORY_ICONS = {
  definitions: "BookOpen",
  synonyms: "ArrowRightLeft",
  antonyms: "RotateCcw"
}

const MainFeature = () => {
  const [gameState, setGameState] = useState('menu') // menu, playing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [gameQuestions, setGameQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0)
  const [difficulty, setDifficulty] = useState('all')

  // Timer effect
  useEffect(() => {
    let timer
    if (gameState === 'playing' && timeLeft > 0 && !showAnswer) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'playing' && !showAnswer) {
      handleTimeUp()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState, showAnswer])

  const startGame = () => {
    let filteredQuestions = QUIZ_DATA
    if (difficulty !== 'all') {
      filteredQuestions = QUIZ_DATA.filter(q => q.difficulty === difficulty)
    }
    
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
    setGameQuestions(shuffled)
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setTimeLeft(30)
    setStreak(0)
  }

  const handleTimeUp = () => {
    setShowAnswer(true)
    setStreak(0)
    toast.error("Time's up! ⏰")
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showAnswer) return
    
    setSelectedAnswer(answerIndex)
    setShowAnswer(true)
    
    const isCorrect = answerIndex === gameQuestions[currentQuestionIndex].correctAnswer
    
    if (isCorrect) {
      const points = timeLeft > 20 ? 100 : timeLeft > 10 ? 75 : 50
      setScore(score + points)
      setStreak(streak + 1)
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
      toast.success(`Correct! +${points} points 🎉`)
    } else {
      setStreak(0)
      toast.error("Incorrect answer! 😞")
    }
    
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
      setTimeLeft(30)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setGameState('results')
    setTotalGamesPlayed(totalGamesPlayed + 1)
    
    const percentage = (score / (gameQuestions.length * 100)) * 100
    if (percentage >= 80) {
      toast.success("Excellent performance! 🏆")
    } else if (percentage >= 60) {
      toast.success("Good job! 👏")
    } else {
      toast.info("Keep practicing! 📚")
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setGameQuestions([])
    setTimeLeft(30)
    setStreak(0)
  }

  const currentQuestion = gameQuestions[currentQuestionIndex]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <AnimatePresence mode="wait">
        {/* Menu State */}
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 sm:mb-12"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl shadow-glow flex items-center justify-center">
                <ApperIcon name="Brain" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
                WordWise Quiz
              </h1>
              <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                Challenge your vocabulary knowledge with interactive word quizzes, definitions, synonyms, and antonyms!
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="quiz-card text-center"
              >
                <ApperIcon name="Trophy" className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-semibold text-surface-700 dark:text-surface-300">Best Streak</h3>
                <p className="text-2xl font-bold text-gradient">{bestStreak}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="quiz-card text-center"
              >
                <ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-surface-700 dark:text-surface-300">Games Played</h3>
                <p className="text-2xl font-bold text-gradient">{totalGamesPlayed}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="quiz-card text-center"
              >
                <ApperIcon name="Star" className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold text-surface-700 dark:text-surface-300">Total Questions</h3>
                <p className="text-2xl font-bold text-gradient">{QUIZ_DATA.length}</p>
              </motion.div>
            </div>

            {/* Difficulty Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-surface-700 dark:text-surface-300">
                Choose Difficulty
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['all', 'easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="game-button game-button-primary text-lg px-8 py-4"
            >
              <ApperIcon name="Play" className="w-6 h-6 mr-2 inline" />
              Start Quiz
            </motion.button>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-4xl mx-auto"
          >
            {/* Game Header */}
            <div className="quiz-card mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="score-badge">
                    <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                    {score} pts
                  </div>
                  {streak > 0 && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <ApperIcon name="Flame" className="w-4 h-4 mr-1" />
                      {streak} streak
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                    <ApperIcon name="Clock" className="w-5 h-5" />
                    <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                      {timeLeft}s
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {currentQuestionIndex + 1}/{gameQuestions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / gameQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="quiz-card mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${DIFFICULTY_COLORS[currentQuestion.difficulty]} flex items-center justify-center`}>
                    <ApperIcon 
                      name={CATEGORY_ICONS[currentQuestion.category]} 
                      className="w-5 h-5 text-white" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                      {currentQuestion.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${DIFFICULTY_COLORS[currentQuestion.difficulty]} text-white`}>
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-surface-800 dark:text-surface-200 mb-6 sm:mb-8">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "answer-button"
                  
                  if (showAnswer) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass += " answer-button-correct"
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      buttonClass += " answer-button-incorrect"
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!showAnswer ? { scale: 1.02 } : {}}
                      whileTap={!showAnswer ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showAnswer && index === currentQuestion.correctAnswer && (
                          <ApperIcon name="Check" className="w-5 h-5 text-green-600" />
                        )}
                        {showAnswer && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                          <ApperIcon name="X" className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Results State */}
        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="quiz-card mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-glow flex items-center justify-center">
                <ApperIcon name="Trophy" className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient">
                Quiz Complete!
              </h2>
              
              <div className="text-6xl sm:text-7xl font-bold mb-4 text-gradient">
                {score}
              </div>
              
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-6">
                Final Score
              </p>

              {/* Results Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round((score / (gameQuestions.length * 100)) * 100)}%
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    Accuracy
                  </div>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {bestStreak}
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    Best Streak
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="game-button game-button-primary"
                >
                  <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
                  Play Again
                </button>
                
                <button
                  onClick={resetGame}
                  className="game-button game-button-secondary"
                >
                  <ApperIcon name="Home" className="w-5 h-5 mr-2" />
                  Main Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature