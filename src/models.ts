import { model, Schema } from "mongoose"
import { SNP500StockDocument } from "./interfaces"

export const QuoteSchema: Schema = new Schema({
  date: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
})

export const SNP500StockSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  security: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  dateAdded: { type: Date },
  description: { type: String },
  exchange: { type: String },
  yearlyHighest: { type: Number },
  yearlyLowest: { type: Number },
  sharesOutstanding: { type: Number },
  lastQuote: QuoteSchema,
})

export const SNP500StockModel = model<SNP500StockDocument>('snp500-stocks-sample', SNP500StockSchema)
export const SNP500StockSampleModel = model<SNP500StockDocument>('snp500-stocks-sample', SNP500StockSchema)
