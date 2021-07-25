import { findStocks, makeRequests } from './quotes'
import { SNP500Stock, SNP500StockDocument } from '../interfaces'
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
    const requests = await makeRequests([
      new SNP500StockModel({symbol: 'MMM'}),
      new SNP500StockModel({symbol: 'AAPL'}),
    ])
    await Promise.all(requests)
    const start = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    expect(axiosMock.get).toHaveBeenCalledWith(
      `https://sandbox.tradier.com/v1/markets/history?symbol=MMM&start=${start}&interval=daily`,
      expect.anything(),
    )
    expect(axiosMock.get).toHaveBeenCalledWith(
      `https://sandbox.tradier.com/v1/markets/history?symbol=AAPL&start=${start}&interval=daily`,
      expect.anything(),
    )
    expect(axiosMock.get).toHaveBeenCalledTimes(2)
  })
})
