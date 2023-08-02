import type { ObjectId } from 'mongodb'

export interface Readme {
  _id?: ObjectId
  username: string
  markdown: string
  created: Date
  updated: Date
  views: number
}
