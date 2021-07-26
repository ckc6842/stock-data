import { makeRequests, requestQuotes } from './quotes'
import axios, { AxiosStatic } from 'axios'
import { config } from 'dotenv'
import { SNP500StockModel } from '../models'

config()

interface AxiosMock extends AxiosStatic {
  mockResolvedValue: Function
  mockRejectedValue: Function
}

jest.mock('axios')
const axiosMock = axios as AxiosMock

describe('일봉 API 요청 및 저장', () => {
  test('요청 목록 생성 및 요청을 정상적으로 수행한다.', async () => {
    const requests = await makeRequests(
      [
        new SNP500StockModel({symbol: 'MMM'}),
        new SNP500StockModel({symbol: 'AAPL'}),
      ],
      requestQuotes
    )
    const response = await Promise.all(requests)

    const apiUrlBase = 'https://www.alphavantage.co/query?'
    const apiKey = process.env.ALPHA_VANTAGE_TOKEN
    expect(axiosMock.get).toHaveBeenCalledWith (
      `${apiUrlBase}function=TIME_SERIES_DAILY_ADJUSTED&symbol=MMM&apikey=${apiKey}`,
    )
    expect(axiosMock.get).toHaveBeenCalledWith(
      `${apiUrlBase}function=TIME_SERIES_DAILY_ADJUSTED&symbol=AAPL&apikey=${apiKey}`,
    )
    expect(axiosMock.get).toHaveBeenCalledTimes(2)
  })
})
