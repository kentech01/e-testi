import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts';
import { Card, CardContent } from './ui/card';

interface InteractiveGraphProps {
  functionType: 'quadratic' | 'linear' | 'exponential' | 'trigonometric';
  coefficients?: {
    a?: number;
    b?: number;
    c?: number;
    d?: number;
  };
  domain?: {
    x: [number, number];
    y: [number, number];
  };
  showGrid?: boolean;
  showAxes?: boolean;
  title?: string;
  className?: string;
}

export function InteractiveGraph({
  functionType,
  coefficients = { a: 1, b: 0, c: 0, d: 0 },
  domain = { x: [-10, 10], y: [-10, 10] },
  showGrid = true,
  showAxes = true,
  title,
  className = ''
}: InteractiveGraphProps) {
  
  const data = useMemo(() => {
    const points = [];
    const step = (domain.x[1] - domain.x[0]) / 200;
    const { a = 1, b = 0, c = 0, d = 0 } = coefficients;
    
    for (let x = domain.x[0]; x <= domain.x[1]; x += step) {
      let y = 0;
      
      switch (functionType) {
        case 'quadratic':
          y = a * x * x + b * x + c;
          break;
        case 'linear':
          y = a * x + b;
          break;
        case 'exponential':
          y = a * Math.pow(Math.E, b * x) + c;
          break;
        case 'trigonometric':
          y = a * Math.sin(b * x + c) + d;
          break;
        default:
          y = x;
      }
      
      // Clamp y values to domain
      if (y >= domain.y[0] && y <= domain.y[1]) {
        points.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(y.toFixed(3)) });
      }
    }
    
    return points;
  }, [functionType, coefficients, domain]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm">
            <span className="font-medium">x:</span> {parseFloat(label).toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="font-medium">y:</span> {parseFloat(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`w-full ${className}`}>
      {title && (
        <div className="p-4 pb-0">
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      )}
      <CardContent className="p-4">
        <div className="w-full h-80 bg-white rounded-lg border">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e0e0e0" 
                  strokeWidth={0.5}
                />
              )}
              
              <XAxis 
                type="number"
                dataKey="x"
                domain={domain.x}
                tickCount={11}
                axisLine={showAxes}
                tickLine={showAxes}
                tick={{ fontSize: 10, fill: '#666' }}
              />
              
              <YAxis 
                type="number"
                domain={domain.y}
                tickCount={11}
                axisLine={showAxes}
                tickLine={showAxes}
                tick={{ fontSize: 10, fill: '#666' }}
              />
              
              {showAxes && (
                <>
                  <ReferenceLine x={0} stroke="#333" strokeWidth={1} />
                  <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
                </>
              )}
              
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Function equation display */}
        <div className="mt-4 text-center">
          <div className="bg-muted rounded px-3 py-2 inline-block">
            <span className="text-sm font-mono">
              {functionType === 'quadratic' && (
                `y = ${coefficients.a || 1}x² ${coefficients.b ? (coefficients.b > 0 ? '+' : '') + coefficients.b + 'x' : ''} ${coefficients.c ? (coefficients.c > 0 ? '+' : '') + coefficients.c : ''}`
              )}
              {functionType === 'linear' && (
                `y = ${coefficients.a || 1}x ${coefficients.b ? (coefficients.b > 0 ? '+' : '') + coefficients.b : ''}`
              )}
              {functionType === 'exponential' && (
                `y = ${coefficients.a || 1}e^(${coefficients.b || 1}x) ${coefficients.c ? (coefficients.c > 0 ? '+' : '') + coefficients.c : ''}`
              )}
              {functionType === 'trigonometric' && (
                `y = ${coefficients.a || 1}sin(${coefficients.b || 1}x ${coefficients.c ? (coefficients.c > 0 ? '+' : '') + coefficients.c : ''}) ${coefficients.d ? (coefficients.d > 0 ? '+' : '') + coefficients.d : ''}`
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}