import { SNP500StockDocument } from "../interfaces"
import { SNP500StockModel } from "../models"
import { getConnection } from "./connection"

export const paginateStocks = async (
  skip: number = 0,
  limit: number = 50,
  query: object = {}
): Promise<SNP500StockDocument[]> => {
  const db = await getConnection()
  const stocks = SNP500StockModel.find(query)
    .sort({'_id': 1})
    .skip(skip)
    .limit(limit)
    .exec()
  return stocks
}
