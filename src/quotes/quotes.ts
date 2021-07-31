import axios, { AxiosPromise, AxiosResponse } from 'axios'
import { config } from 'dotenv'
import { SNP500StockModel } from '../models'
import { paginateStocks } from '../db/stocks'
import { Quote, SNP500StockDocument } from '../interfaces'
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

const requestCompanyOverview = (symbol: string): AxiosPromise => {
  const queryUrl = makeQueryUrl({
    function: 'OVERVIEW',
    symbol
  })
  return axios.get(queryUrl)
}

export const requestEachPeriod = (
  stocks: SNP500StockDocument[],
  requestMethod: Function,
  saveMethod: Function,
  count: number,
  period: number
): Promise<any> => {
  return new Promise(async (resolve) => {
    let resultCount = 0
    const stockGroups = stocks
      .reduce((prev: SNP500StockDocument[][], stock: SNP500StockDocument): SNP500StockDocument[][] => {
        if (prev.length === 0 || prev[prev.length - 1].length === count) {
          return [...prev, [stock]]
        } else {
          return [...prev.slice(0, prev.length - 1), [...prev[prev.length - 1], stock]]
        }
      }, [] as SNP500StockDocument[][])
      stockGroups.forEach((stockGroup: SNP500StockDocument[], index: number) => {
      setTimeout(async () => {
        const requests = makeRequests(stockGroup, requestMethod)
        const responses = await Promise.all(requests)
        await saveMethod(responses)
        resultCount += responses.length
        if (resultCount === stocks.length) {
          resolve(true)
        }
      }, period * index)
    })
  })
}

const parseAndSaveOverview = async (responses: AxiosResponse[]) => {
  const writes = responses.map((response: AxiosResponse) => {
    const yearlyHighestKey = '52WeekHigh'
    const yearlyLowestKey = '52WeekLow'
    const {
      Symbol: symbol,
      Description: description,
      Exchange: exchange,
      [yearlyHighestKey]: yearlyHighest,
      [yearlyLowestKey]: yearlyLowest,
      SharesOutstanding: sharesOutstanding,
    } = response.data
    return {
      updateOne: {
        filter: { symbol },
        update: {
          description,
          exchange,
          yearlyHighest,
          yearlyLowest,
          sharesOutstanding,
        }
      }
    }
  })
  const result = await SNP500StockModel.bulkWrite(writes)
}

const parseAndSaveQuote = async (responses: AxiosResponse[]) => {
  const writes = responses.map((response: AxiosResponse) => {
    // TODO: 이 API는 CSV 기반으로 parsing 하는 편이 좋을 듯
    const {
      ['Meta Data']: metaData,
      ['Time Series (Daily)']: timeSeries,
    } = response.data
    const {
      ['2. Symbol']: symbol,
      ['3. Last Refreshed']: lastRefreshed
    } = metaData

    const {
      ['1. open']: open,
      ['2. high']: high,
      ['3. low']: low,
      ['4. close']: close,
      ['6. volume']: volume
    } = timeSeries[lastRefreshed]

    const lastQuote: Quote = {
      open,
      high,
      close,
      low,
      volume,
      date: new Date(lastRefreshed)
    }

    return {
      updateOne: {
        filter: { symbol },
        update: {
          lastQuote
        }
      }
    }
  })
  const result = await SNP500StockModel.bulkWrite(writes)
}

const execute = async () => {
  const page = 0
  const itemPerPage = 5
  const stocks = await paginateStocks(page, itemPerPage)
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const responses = await requestEachPeriod(
    stocks,
    requestQuotes,
    parseAndSaveQuote,
  5, 2 * MINUTE)
  process.exit(0)
}

execute()
