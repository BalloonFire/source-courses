"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
    data: {
        courseTitle: string;
        total: number;
    }[];
}

export const Chart = ({ 
    data 
}: ChartProps) => {
    return (
        <Card>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis 
                    dataKey="courseTitle" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`} 
                    />
                    <Bar 
                    dataKey="total"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}