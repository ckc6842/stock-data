import { config } from 'dotenv'
import { getConnection } from '../db'
import { SNP500StockDocument } from '../interfaces'
import { SNP500StockModel } from '../models'
config()

export const findStocks = async (skip: number = 0, limit: number = 50): Promise<SNP500StockDocument[]> => {
  const db = await getConnection()
  const stocks = SNP500StockModel.find().sort({'_id': 1}).skip(skip).limit(limit).exec()
  return stocks
}
