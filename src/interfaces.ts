import { Document, ObjectId } from "mongoose";

export interface Quote {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

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
  lastQuote?: Quote
}

export interface SNP500StockDocument extends SNP500Stock, Document {
  _id: ObjectId
}
