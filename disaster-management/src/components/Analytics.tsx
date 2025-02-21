import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useDisasterStore } from '../store/disaster';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const { disasters, reports, resources } = useDisasterStore();

  const disasterTrends = {
    labels: disasters
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map(d => format(new Date(d.created_at), 'MMM d')),
    datasets: [
      {
        label: 'Active Disasters',
        data: disasters.map(d => d.severity),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  const resourceAllocation = {
    labels: ['Medical', 'Food', 'Water', 'Shelter', 'Rescue', 'Transport'],
    datasets: [
      {
        label: 'Available Resources',
        data: ['medical', 'food', 'water', 'shelter', 'rescue', 'transport'].map(
          type => resources.filter(r => r.type === type && r.status === 'available').length
        ),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Deployed Resources',
        data: ['medical', 'food', 'water', 'shelter', 'rescue', 'transport'].map(
          type => resources.filter(r => r.type === type && r.status === 'deployed').length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Disaster Trends</h3>
        <Line
          data={disasterTrends}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Disaster Severity Over Time',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
              },
            },
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
        <Bar
          data={resourceAllocation}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Resource Distribution by Type',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}