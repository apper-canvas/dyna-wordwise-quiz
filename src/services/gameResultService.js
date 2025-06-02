import { toast } from 'react-toastify'

class GameResultService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async fetchUserGameResults(userId = null) {
    try {
      const tableName = 'game_result'
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy',
        'ModifiedOn', 'ModifiedBy', 'score', 'best_streak', 
        'total_games_played', 'difficulty'
      ]

      let params = {
        fields: fields,
        orderBy: [
          {
            fieldName: "CreatedOn",
            SortType: "DESC"
          }
        ]
      }

      // Filter by user if provided
      if (userId) {
        params.where = [
          {
            fieldName: "CreatedBy",
            operator: "EqualTo",
            values: [userId]
          }
        ]
      }

      const response = await this.client.fetchRecords(tableName, params)
      
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Error fetching game results:", error)
      toast.error("Failed to load game results")
      return []
    }
  }

  async saveGameResult(gameData) {
    try {
      const tableName = 'game_result'
      
      // Only include updateable fields
      const params = {
        records: [
          {
            Name: `Game Result ${new Date().toISOString()}`,
            score: gameData.score,
            best_streak: gameData.bestStreak,
            total_games_played: gameData.totalGamesPlayed,
            difficulty: gameData.difficulty || 'all'
          }
        ]
      }

      const response = await this.client.createRecord(tableName, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success("Game result saved successfully!")
        return response.results[0].data
      } else {
        throw new Error("Failed to save game result")
      }
    } catch (error) {
      console.error("Error saving game result:", error)
      toast.error("Failed to save game result")
      throw error
    }
  }

  async getUserStats(userId = null) {
    try {
      const gameResults = await this.fetchUserGameResults(userId)
      
      if (gameResults.length === 0) {
        return {
          totalGamesPlayed: 0,
          bestStreak: 0,
          averageScore: 0,
          totalScore: 0
        }
      }

      const totalGamesPlayed = gameResults.length
      const bestStreak = Math.max(...gameResults.map(result => result.best_streak || 0))
      const totalScore = gameResults.reduce((sum, result) => sum + (result.score || 0), 0)
      const averageScore = Math.round(totalScore / totalGamesPlayed)

      return {
        totalGamesPlayed,
        bestStreak,
        averageScore,
        totalScore
      }
    } catch (error) {
      console.error("Error calculating user stats:", error)
      return {
        totalGamesPlayed: 0,
        bestStreak: 0,
        averageScore: 0,
        totalScore: 0
      }
    }
  }

  async updateGameResult(resultId, gameData) {
    try {
      const tableName = 'game_result'
      
      // Only include updateable fields plus Id
      const params = {
        records: [
          {
            Id: resultId,
            Name: gameData.name || `Game Result ${new Date().toISOString()}`,
            score: gameData.score,
            best_streak: gameData.bestStreak,
            total_games_played: gameData.totalGamesPlayed,
            difficulty: gameData.difficulty || 'all'
          }
        ]
      }

      const response = await this.client.updateRecord(tableName, params)
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success("Game result updated successfully!")
        return response.results[0].data
      } else {
        throw new Error("Failed to update game result")
      }
    } catch (error) {
      console.error("Error updating game result:", error)
      toast.error("Failed to update game result")
      throw error
    }
  }

  async deleteGameResult(resultId) {
    try {
      const tableName = 'game_result'
      const params = {
        RecordIds: [resultId]
      }

      const response = await this.client.deleteRecord(tableName, params)
      
      if (response && response.success) {
        toast.success("Game result deleted successfully!")
        return true
      } else {
        throw new Error("Failed to delete game result")
      }
    } catch (error) {
      console.error("Error deleting game result:", error)
      toast.error("Failed to delete game result")
      throw error
    }
  }
}

export default new GameResultService()