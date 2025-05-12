"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatTimestamp } from "@/lib/utils"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface DifficultyData {
  blockHeight: number
  difficulty: number
  timestamp: number
}

interface DifficultyChartProps {
  data: DifficultyData[]
}

export function DifficultyChart({ data }: DifficultyChartProps) {
  const [activePoint, setActivePoint] = useState<DifficultyData | null>(null)

  // Format the data for the chart
  const chartData = data.map((item) => ({
    blockHeight: item.blockHeight,
    difficulty: item.difficulty,
    timestamp: item.timestamp,
    formattedDifficulty: formatNumber(item.difficulty),
    formattedTimestamp: formatTimestamp(item.timestamp),
  }))

  // Define chart colors based on Aegisum logo
  const chartConfig = {
    difficulty: {
      label: "Difficulty",
      theme: {
        light: "#3b82f6", // Blue color for light mode
        dark: "#60a5fa", // Lighter blue for dark mode
      },
    },
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-1">Block #{data.blockHeight}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.formattedTimestamp}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <p className="text-sm">
              <span className="text-muted-foreground mr-1">Difficulty:</span>
              <span className="font-mono">{data.formattedDifficulty}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Difficulty</CardTitle>
        <CardDescription>Difficulty adjustment over the last {data.length} blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined && chartData[e.activeTooltipIndex]) {
                  setActivePoint(chartData[e.activeTooltipIndex])
                }
              }}
              onMouseLeave={() => setActivePoint(null)}
            >
              <defs>
                <linearGradient id="difficultyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="blockHeight"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tickFormatter={(value) => `#${value}`}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                  return value.toFixed(1)
                }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="difficulty"
                name="Difficulty"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#difficultyGradient)"
                strokeWidth={2}
                activeDot={{ r: 6, stroke: "#1d4ed8", strokeWidth: 2, fill: "#60a5fa" }}
                isAnimationActive={false}
              />
              {activePoint && (
                <ReferenceLine x={activePoint.blockHeight} stroke="#1d4ed8" strokeDasharray="3 3" strokeWidth={1.5} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
