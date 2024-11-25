"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, Thermometer } from "lucide-react";

interface DataPoint {
  time: string;
  cpu: number;
  memory: number;
  temperature: number;
  [key: string]: number | string;
}

interface MetricConfig {
  label: string;
  color: string;
  icon: JSX.Element;
  unit: string;
}

const generateRandomData = (): DataPoint => ({
  time: new Date().toLocaleTimeString(),
  cpu: Math.random() * 100,
  memory: Math.random() * 16,
  temperature: 20 + Math.random() * 40,
});

export default function Dashboard() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("cpu");
  const [animatingIndex, setAnimatingIndex] = useState(-1);

  const addData = useCallback(() => {
    setData((currentData) => {
      const newData = [...currentData, generateRandomData()];
      if (newData.length > 20) newData.shift(); // Mantiene solo los últimos 20 puntos
      setAnimatingIndex(newData.length - 1); // Actualiza el índice de animación
      return newData;
    });
  }, []);

  useEffect(() => {
    let interval: any;
    if (isReceiving) {
      interval = setInterval(addData, 1000);
    }
    return () => clearInterval(interval);
  }, [isReceiving, addData]);

  const toggleReceiving = () => {
    setIsReceiving(!isReceiving);
  };

  const metricConfig: Record<string, MetricConfig> = {
    cpu: {
      label: "Uso de CPU",
      color: "hsl(152, 100%, 50%)",
      icon: <Cpu className="h-4 w-4" />,
      unit: "%",
    },
    memory: {
      label: "Uso de Memoria",
      color: "hsl(206, 100%, 50%)",
      icon: <Activity className="h-4 w-4" />,
      unit: "GB",
    },
    temperature: {
      label: "Temperatura",
      color: "hsl(0, 100%, 50%)",
      icon: <Thermometer className="h-4 w-4" />,
      unit: "°C",
    },
  };

  return (
    <div className="max-h-screen bg-background">
      <Card className="w-full max-w-full mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">
                Monitor del Sistema en Tiempo Real
              </CardTitle>
              <CardDescription className="text-sm">
                Datos en vivo recibidos vía WebSocket (simulado)
              </CardDescription>
            </div>
            <Badge
              variant={isReceiving ? "default" : "secondary"}
              className="self-start sm:self-auto"
            >
              {isReceiving ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Seleccionar métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpu">Uso de CPU</SelectItem>
                <SelectItem value="memory">Uso de Memoria</SelectItem>
                <SelectItem value="temperature">Temperatura</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={toggleReceiving} className="w-full sm:w-auto">
              {isReceiving ? "Detener Simulación" : "Iniciar Simulación"}
            </Button>
          </div>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ transform: "translate(0, 6)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${value.toFixed(0)}${metricConfig[selectedMetric].unit}`
                  }
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (
                      active &&
                      payload &&
                      payload.length > 0 &&
                      typeof payload[0].value === "number"
                    ) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="uppercase text-muted-foreground">
                                {metricConfig[selectedMetric].label}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value.toFixed(2)}{" "}
                                {metricConfig[selectedMetric].unit}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="uppercase text-muted-foreground">
                                Tiempo
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].payload.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricConfig[selectedMetric].color}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    const isAnimating = index === animatingIndex;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isAnimating ? 5 : 3}
                        fill={metricConfig[selectedMetric].color}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                        style={{
                          transition: isAnimating ? "r 0.3s ease-out" : "none",
                        }}
                      />
                    );
                  }}
                  activeDot={{
                    fill: metricConfig[selectedMetric].color,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                    r: 5,
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(metricConfig).map(
              ([key, { label, icon, unit }]) => (
                <div
                  key={key}
                  className="flex items-center justify-between sm:justify-center gap-2 bg-muted p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium text-sm">{label}:</span>
                  </div>
                  <span className="text-sm">
                    {data.length > 0
                      ? `${(data[data.length - 1] as any)[
                          key as keyof DataPoint
                        ].toFixed(2)} ${unit}`
                      : "N/A"}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
