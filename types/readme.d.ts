import type { ObjectId } from 'mongodb'
import { GitHubRepository } from './github'

export interface Readme {
  _id?: ObjectId
  username: string
  markdown: string
  created: Date
  updated: Date
  views: number
  branch: string
  repo: GitHubRepository
}
