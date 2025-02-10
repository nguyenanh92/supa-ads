import { NextResponse } from 'next/server'
import convert from 'xml-js'

const baseUrl = process.env.BANK_URL

export async function GET(request: Request) {
  try {
    if (!baseUrl) {
      throw new Error('BANK_URL environment variable is not defined')
    }

    const response = await fetch(baseUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlData = await response.text()
    const data = JSON.parse(
      convert.xml2json(xmlData, { compact: true, spaces: 2 })
    )
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching bank rates:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}