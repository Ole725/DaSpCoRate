// /frontend/src/components/PerformanceChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`Training am ${label}`}</p>
        
        {/* Zeige die Gesamtpunktzahl, wenn sie vorhanden ist */}
        {payload.find(p => p.dataKey === 'totalScore') && (
           <p className="text-indigo-600 font-semibold">{`Gesamtpunktzahl: ${data.totalScore}`}</p>
        )}

        <div className="mt-2 border-t pt-2">
          <p className="text-sm text-gray-600">Runden-Details:</p>
          <ul className="list-disc list-inside text-sm">
            {/* Iteriere über die Payload, um die Runden im Tooltip anzuzeigen */}
            {payload.filter(p => p.dataKey.startsWith('round_')).map(p => (
              <li key={p.dataKey} style={{ color: p.stroke }}>{`${p.name}: ${p.value} Punkte`}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

// Vordefinierte Farben für die Runden-Linien
const ROUND_COLORS = ['#82ca9d', '#ffc658', '#ff8042', '#8884d8', '#ff7300'];

// GEÄNDERT: Die Komponente akzeptiert jetzt eine `rounds`-Prop
function PerformanceChart({ data, rounds }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sessionDate" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalScore"
          name="Gesamtpunktzahl"
          stroke="#4f46e5"
          strokeWidth={3} // Machen wir die Hauptlinie dicker
          activeDot={{ r: 8 }}
        />
        
        {/* NEU: Dynamisches Rendern der Linien für jede Runde */}
        {rounds.map((roundNum, index) => (
          <Line
            key={roundNum}
            type="monotone"
            dataKey={`round_${roundNum}`}
            name={`Runde ${roundNum}`}
            // Wähle eine Farbe aus unserem Array. Der Modulo (%) verhindert Fehler, falls es mehr Runden als Farben gibt.
            stroke={ROUND_COLORS[index % ROUND_COLORS.length]}
            strokeWidth={1.5}
            strokeDasharray="5 5" // Gestrichelte Linie zur Unterscheidung
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PerformanceChart;