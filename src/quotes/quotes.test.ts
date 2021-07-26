import { makeRequests, requestEachPeriod, requestQuotes } from './quotes'
import axios, { AxiosStatic } from 'axios'
import { SNP500StockModel } from '../models'

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

  test('매 분 주어진 개수만큼의 요청을 수행한다.', async () => {
    const requests = await makeRequests(
      [
        new SNP500StockModel({symbol: 'A'}),
        new SNP500StockModel({symbol: 'B'}),
        new SNP500StockModel({symbol: 'C'}),
        new SNP500StockModel({symbol: 'D'}),
        new SNP500StockModel({symbol: 'E'}),
        new SNP500StockModel({symbol: 'F'}),
        new SNP500StockModel({symbol: 'G'}),
        new SNP500StockModel({symbol: 'H'}),
      ],
      requestQuotes
    )

    const period = 300
    const start = new Date().getTime()
    const responses = await requestEachPeriod(requests, 2, period)
    const end = new Date().getTime()
    expect(axiosMock.get).toHaveBeenCalledTimes(8)
    expect(end - start).toBeGreaterThanOrEqual(period * 3)
  })
})
