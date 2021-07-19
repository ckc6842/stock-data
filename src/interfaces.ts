import { Document, ObjectId } from "mongoose";

export interface SNP500Stock {
  symbol: string
  security: string
  sector: string
  industry: string
  dateAdded: Date
}

export interface SNP500StockDocument extends SNP500Stock, Document {
  _id: ObjectId
}
