import axios, { AxiosPromise } from 'axios'
import { config } from 'dotenv'
import { getConnection } from '../db/connection'
import { SNP500StockDocument } from '../interfaces'
import { SNP500StockModel } from '../models'
config()


export const makeRequests = (stocks: Array<SNP500StockDocument>): Array<AxiosPromise> => {
  const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  return stocks.map((stock) => {
    return requestQuotes(stock.symbol, start, 'daily')
  })
}

const requestQuotes = (symbol: string, start: string, interval: string = 'daily'): AxiosPromise => {
  const apiUrlBase = 'https://sandbox.tradier.com/v1'
  const queries = {
    symbol,
    start,
    interval,
  }
  const queryStringList = Object.entries(queries).map(([k, v]) => `${k}=${v}`)
  return axios.get(`${apiUrlBase}/markets/history?${queryStringList.join('&')}`, {
    headers: {
      Authorization: `Bearer ${process.env.TRADIER_TOKEN}`
    }
  })
}
