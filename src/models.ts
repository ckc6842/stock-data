import { model, Schema } from "mongoose"
import { SNP500Stock } from "./interfaces"

const SNP500StockSchema = new Schema<SNP500Stock>({
  symbol: { type: String, required: true },
  security: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  dateAdded: { type: Date },
})

export const SNP500StockModel = model<SNP500Stock>('snp500-stocks', SNP500StockSchema)