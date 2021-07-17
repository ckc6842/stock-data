import axios from 'axios'
import { Node, parse } from 'node-html-parser'

interface SNP500Stock {
  symbol: string
  security: string
  sector: string
  industry: string
  dateAdded: Date
}

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
  const result = body.map((row: Node, idx: number) => {
    let rowData: SNP500Stock = {
      symbol: '',
      security: '',
      sector: '',
      industry: '',
      dateAdded: new Date(),
    }
    row.childNodes.forEach((cell, column) => {
      const text: string = cell.text.replace(/(\r\n|\n|\r)/gm, '')
      switch (column) {
        case COLUMNS.SYMBOL:
          rowData.symbol = text
          break
        case COLUMNS.SECURITY:
          rowData.security = text
          break
        case COLUMNS.SECTOR:
          rowData.sector = text
          break
        case COLUMNS.INDUSTRY:
          rowData.industry = text
          break
        case COLUMNS.ADDED:
          rowData.dateAdded = new Date(text)
          break
        default:
          break
      }
    })
    return rowData
  })
  return result
}


const execute = async () => {
  const rawHTML: string = await getWikiData()
  const parsedTable: any = await parseTable(rawHTML)
}

execute()