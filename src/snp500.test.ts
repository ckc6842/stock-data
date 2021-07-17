import { parseTable } from './snp500'
import rawHtml from './__mock__/snp500.html'

describe('S&P 500 데이터 크롤링', () => {
  test('각 column 데이터를 알맞게 파싱한다.', async () => {
    const expectData = {
      symbol: 'MMM',
      security: '3M',
      sector: 'Industrials',
      industry: 'Industrial Conglomerates',
      dateAdded: new Date('1976-08-09')
    }
    const actualData = await parseTable(rawHtml)
    expect(actualData[0]).toEqual(expectData)
  })

  test('데이터를 505개 정상적으로 수집한다.', async () => {
    // NOTE: 사실 S&P 505였다.
    const actualData = await parseTable(rawHtml)
    expect(actualData.length).toBeGreaterThanOrEqual(505)
  })
})
