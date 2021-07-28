import { Document, ObjectId } from "mongoose";

export interface SNP500Stock {
  symbol: string
  security: string
  sector: string
  industry: string
  dateAdded?: Date
  description?: string,
  exchange?: string,
  yearlyHighest?: number
  yearlyLowest?: number
  sharesOutstanding?: number
}

export interface SNP500StockDocument extends SNP500Stock, Document {
  _id: ObjectId
}
