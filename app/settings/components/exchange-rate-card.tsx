'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

type ExchangeRate = {
  _attributes: {
    CurrencyCode: string
    CurrencyName: string
    Buy: string
    Transfer: string
    Sell: string
  }
}

type ExchangeRateResponse = {
  ExrateList: {
    DateTime: { _text: string }
    Exrate: ExchangeRate[]
    Source: { _text: string }
  }
}

export function ExchangeRateCard() {
  const [rateData, setRateData] = useState<ExchangeRate | null>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('exchangeRate')
    return saved ? JSON.parse(saved) : null
  })
  const [lastUpdate, setLastUpdate] = useState<string>(() => {
    return localStorage.getItem('lastUpdate') || ''
  })
  const [loading, setLoading] = useState(!localStorage.getItem('exchangeRate'))

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/rates')
        const data: ExchangeRateResponse = await response.json()
        
        const usdRate = data.ExrateList.Exrate.find(
          rate => rate._attributes.CurrencyCode === 'USD'
        )
        
        if (usdRate) {
          setRateData(usdRate)
          setLastUpdate(data.ExrateList.DateTime._text)
          // Save to localStorage
          localStorage.setItem('exchangeRate', JSON.stringify(usdRate))
          localStorage.setItem('lastUpdate', data.ExrateList.DateTime._text)
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  if (loading) {
    return <div>Đang tải...</div>
  }

  if (!rateData) {
    return <div>Không thể tải tỷ giá</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỷ giá USD/VND</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Mua</span>
          <span className="text-xl font-bold">{rateData._attributes.Buy}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Chuyển khoản</span>
          <span className="text-xl font-bold">{rateData._attributes.Transfer}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Bán</span>
          <span className="text-xl font-bold">{rateData._attributes.Sell}</span>
        </div>
        <div className="col-span-3 text-sm text-muted-foreground">
          Cập nhật: {lastUpdate}
        </div>
      </CardContent>
    </Card>
  )
} 