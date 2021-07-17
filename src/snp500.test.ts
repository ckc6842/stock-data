import { getWikiData, parseTable } from './snp500'
import axios from 'axios'
import rawHtml from './__mock__/snp500.html'

describe('S&P 500 데이터 크롤링', () => {
  test('각 column 데이터를 알맞게 파싱한다.', async () => {
    const expectData = {
      symbol: 'MMM',
      security: '3M',
      sector: 'Industrials',
      industry: 'Industrial Conglomerates',
      dateAdded: '1976-08-09'
    }
    const actualData = await parseTable(rawHtml)
    expect(actualData).toEqual(expectData)
  })
})
