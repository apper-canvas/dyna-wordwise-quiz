import { toast } from 'react-toastify'

class QuizService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async fetchQuizzes(difficulty = 'all', limit = 20) {
    try {
      const tableName = 'quiz'
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'question', 'correct_answer', 
        'difficulty', 'category'
      ]

      let params = {
        fields: fields,
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      }

      // Add difficulty filter if not 'all'
      if (difficulty !== 'all') {
        params.where = [
          {
            fieldName: "difficulty",
            operator: "ExactMatch",
            values: [difficulty]
          }
        ]
      }

      const response = await this.client.fetchRecords(tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      // Also fetch quiz options for each quiz
      const quizzesWithOptions = await Promise.all(
        response.data.map(async (quiz) => {
          const options = await this.fetchQuizOptions(quiz.Id)
          return {
            id: quiz.Id,
            question: quiz.question,
            options: options.map(opt => opt.option_text),
            correctAnswer: quiz.correct_answer - 1, // Convert to 0-based index
            difficulty: quiz.difficulty,
            category: quiz.category
          }
        })
      )

      return quizzesWithOptions
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      toast.error("Failed to load quizzes")
      return []
    }
  }

  async fetchQuizOptions(quizId) {
    try {
      const tableName = 'quiz_option'
      const fields = ['Id', 'option_text', 'option_index', 'quiz_id']

      const params = {
        fields: fields,
        where: [
          {
            fieldName: "quiz_id",
            operator: "EqualTo",
            values: [quizId]
          }
        ],
        orderBy: [
          {
            fieldName: "option_index",
            SortType: "ASC"
          }
        ]
      }

      const response = await this.client.fetchRecords(tableName, params)
      
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching options for quiz ${quizId}:`, error)
      return []
    }
  }

  async createQuiz(quizData) {
    try {
      const tableName = 'quiz'
      
      // Only include updateable fields
      const params = {
        records: [
          {
            Name: quizData.name || '',
            Tags: quizData.tags || '',
            question: quizData.question,
            correct_answer: quizData.correctAnswer,
            difficulty: quizData.difficulty,
            category: quizData.category
          }
        ]
      }

      const response = await this.client.createRecord(tableName, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success("Quiz created successfully!")
        return response.results[0].data
      } else {
        throw new Error("Failed to create quiz")
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast.error("Failed to create quiz")
      throw error
    }
  }

  async updateQuiz(quizId, quizData) {
    try {
      const tableName = 'quiz'
      
      // Only include updateable fields plus Id
      const params = {
        records: [
          {
            Id: quizId,
            Name: quizData.name || '',
            Tags: quizData.tags || '',
            question: quizData.question,
            correct_answer: quizData.correctAnswer,
            difficulty: quizData.difficulty,
            category: quizData.category
          }
        ]
      }

      const response = await this.client.updateRecord(tableName, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success("Quiz updated successfully!")
        return response.results[0].data
      } else {
        throw new Error("Failed to update quiz")
      }
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast.error("Failed to update quiz")
      throw error
    }
  }

  async deleteQuiz(quizId) {
    try {
      const tableName = 'quiz'
      const params = {
        RecordIds: [quizId]
      }

      const response = await this.client.deleteRecord(tableName, params)
      
      if (response && response.success) {
        toast.success("Quiz deleted successfully!")
        return true
      } else {
        throw new Error("Failed to delete quiz")
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast.error("Failed to delete quiz")
      throw error
    }
  }
}

export default new QuizService()