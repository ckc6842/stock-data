import { model, Schema } from "mongoose"
import { SNP500StockDocument } from "./interfaces"

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
})

export const SNP500StockModel = model<SNP500StockDocument>('snp500-stocks', SNP500StockSchema)
