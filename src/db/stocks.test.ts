import { paginateStocks } from "./stocks"

describe('SNP500Stocks collection', () => {
  test.each([
    [0, 1, 0, 'MMM'], // 기본 find
    [1, 1, 0, 'ABT'], // skip 테스트
    [0, 50, 49, 'ANET'], // limit 테스트
    [50, 50, 49, 'CRL'], // skip + limit 테스트
  ])('findStocks skip: %s, limit: %s에 대한 %s번째 index symbol은 %s이다.', async (
    skip: number,
    limit: number,
    index: number,
    symbol: string
  ) => {
    const stocks = await paginateStocks(skip, limit)
    expect(stocks[index].symbol).toEqual(symbol)
  })
})
