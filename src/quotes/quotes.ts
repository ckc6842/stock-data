import axios, { AxiosPromise } from 'axios'
import { config } from 'dotenv'
import { SNP500StockDocument } from '../interfaces'
config()

const apiUrlBase = 'https://www.alphavantage.co/query?'

const makeQueryUrl = (params: object): string => {
  const queries = {
    ...params,
    apikey: process.env.ALPHA_VANTAGE_TOKEN,
  }
  const queryStringList = Object.entries(queries).map(([k, v]) => `${k}=${v}`)
  return apiUrlBase + queryStringList.join('&')
}

export const makeRequests = (
  stocks: Array<SNP500StockDocument>,
  requestMethod: Function
): Array<AxiosPromise> => {
  return stocks.map((stock) => {
    return requestMethod(stock.symbol)
  })
}

export const requestQuotes = (symbol: string): AxiosPromise => {
  return axios.get(makeQueryUrl({
    function: 'TIME_SERIES_DAILY_ADJUSTED',
    symbol
  }))
}
