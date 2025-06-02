import { toast } from 'react-toastify'

class QuizOptionService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async fetchQuizOptions(quizId) {
    try {
      const tableName = 'quiz_option'
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy',
        'ModifiedOn', 'ModifiedBy', 'option_text', 'option_index', 'quiz_id'
      ]

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
      toast.error("Failed to load quiz options")
      return []
    }
  }

  async createQuizOptions(quizId, options) {
    try {
      const tableName = 'quiz_option'
      
      // Create records for each option
      const records = options.map((optionText, index) => ({
        Name: `Option ${index + 1}`,
        option_text: optionText,
        option_index: index + 1,
        quiz_id: quizId
      }))

      const params = {
        records: records
      }

      const response = await this.client.createRecord(tableName, params)
      
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          toast.success(`Created ${successfulRecords.length} quiz options successfully!`)
          return successfulRecords.map(result => result.data)
        }
      }
      
      throw new Error("Failed to create quiz options")
    } catch (error) {
      console.error("Error creating quiz options:", error)
      toast.error("Failed to create quiz options")
      throw error
    }
  }

  async updateQuizOption(optionId, optionData) {
    try {
      const tableName = 'quiz_option'
      
      // Only include updateable fields plus Id
      const params = {
        records: [
          {
            Id: optionId,
            Name: optionData.name || `Option ${optionData.option_index}`,
            option_text: optionData.option_text,
            option_index: optionData.option_index,
            quiz_id: optionData.quiz_id
          }
        ]
      }

      const response = await this.client.updateRecord(tableName, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success("Quiz option updated successfully!")
        return response.results[0].data
      } else {
        throw new Error("Failed to update quiz option")
      }
    } catch (error) {
      console.error("Error updating quiz option:", error)
      toast.error("Failed to update quiz option")
      throw error
    }
  }

  async deleteQuizOptions(quizId) {
    try {
      // First fetch all options for the quiz
      const options = await this.fetchQuizOptions(quizId)
      
      if (options.length === 0) {
        return true
      }

      const tableName = 'quiz_option'
      const optionIds = options.map(option => option.Id)
      
      const params = {
        RecordIds: optionIds
      }

      const response = await this.client.deleteRecord(tableName, params)
      
      if (response && response.success) {
        toast.success("Quiz options deleted successfully!")
        return true
      } else {
        throw new Error("Failed to delete quiz options")
      }
    } catch (error) {
      console.error("Error deleting quiz options:", error)
      toast.error("Failed to delete quiz options")
      throw error
    }
  }
}

export default new QuizOptionService()