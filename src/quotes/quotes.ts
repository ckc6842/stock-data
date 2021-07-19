import { config } from 'dotenv'
import { getConnection } from '../db'
import { SNP500StockModel } from '../models'
config()

export const findStocks = async (skip: number, limit: number = 50) => {
  const db = await getConnection()
  const stocks = SNP500StockModel.find().sort({'_id': 1}).skip(skip).limit(limit)
  return stocks
}
