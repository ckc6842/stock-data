import axios from 'axios'
import { parse } from 'node-html-parser'

export const getWikiData = async () => {
  const url: string = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
  const req: any = await axios.get(url)
  return req.data
}

const COLUMNS = {
  SYMBOL: 1,
  SECURITY: 3,
  SECTOR: 7,
  INDUSTRY: 9,
  ADDED: 13,
}

export const parseTable = async (rawHTML: string) => {
  const document = parse(rawHTML)
  const tableRows = document.querySelectorAll('#constituents tr')
  const body = tableRows.slice(1)
  const result = {
    symbol: '',
    security: '',
    sector: '',
    industry: '',
    dateAdded: ''
  }
  body.forEach((row, idx) => {
    if (idx !== 0) return
    row.childNodes.forEach((cell, column) => {
      switch (column) {
        case COLUMNS.SYMBOL:
          result.symbol = cell.text.replace(/(\r\n|\n|\r)/gm, '')
          break
        case COLUMNS.SECURITY:
          result.security = cell.text.replace(/(\r\n|\n|\r)/gm, '')
          break
        case COLUMNS.SECTOR:
          result.sector = cell.text.replace(/(\r\n|\n|\r)/gm, '')
          break
        case COLUMNS.INDUSTRY:
          result.industry = cell.text.replace(/(\r\n|\n|\r)/gm, '')
          break
        case COLUMNS.ADDED:
          result.dateAdded = cell.text.replace(/(\r\n|\n|\r)/gm, '')
          break
        default:
          break
      }
    });
  })
  return result
}


const execute = async () => {
  const rawHTML: string = await getWikiData()
  const parsedTable: any = await parseTable(rawHTML)
}

execute()