import axios, { AxiosPromise, AxiosResponse } from 'axios'
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

export const requestEachPeriod = (requests: AxiosPromise[], count: number, period: number): Promise<any> => {
  return new Promise(async (resolve) => {
    let result: AxiosResponse[] = []
    const requestGroups = requests
      .reduce((prev: AxiosPromise[][], request: AxiosPromise): AxiosPromise[][] => {
        if (prev.length === 0 || prev[prev.length - 1].length === count) {
          return [...prev, [request]]
        } else {
          return [...prev.slice(0, prev.length - 1), [...prev[prev.length - 1], request]]
        }
      }, [] as AxiosPromise[][])
    requestGroups.forEach((requestGroup: AxiosPromise[], index: number) => {
      setTimeout(async () => {
        const responses = await Promise.all(requestGroup)
        result = [...result, ...responses]
        if (result.length === requests.length) {
          resolve(result)
        }
      }, period * index)
    })
  })
}
