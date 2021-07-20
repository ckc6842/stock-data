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
  test.each([
    [0, 1, 0, 'MMM'], // 기본 find
    [1, 1, 0, 'ABT'], // skip 테스트
    [0, 50, 49, 'ANET'], // limit 테스트
    [50, 50, 49, 'CRL'], // skip + limit 테스트
  ])('findStocks skip: %s, limit: %s에 대한 %s번째 index symbol은 %s이다.', async (skip: number, limit: number, index: number, symbol: string) => {
    const stocks = await findStocks(skip, limit)
    expect(stocks[index].symbol).toEqual(symbol)
  })

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
