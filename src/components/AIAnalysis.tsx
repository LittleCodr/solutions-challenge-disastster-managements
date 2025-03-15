import React, { useState } from 'react';
import { Brain, AlertTriangle, FileText, Shield } from 'lucide-react';
import { analyzeSeverity, predictResourceNeeds, detectMisinformation, generateSituationReport } from '../lib/gemini';
import { useDisasterStore } from '../store/disaster';

export default function AIAnalysis() {
  const { disasters, reports } = useDisasterStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    severity?: string;
    resources?: string;
    misinformation?: string;
    situationReport?: string;
  }>({});

  const handleAnalyzeDisaster = async (disasterId: string) => {
    setLoading(true);
    try {
      const disaster = disasters.find(d => d.id === disasterId);
      if (!disaster) return;

      const [severityAnalysis, resourcePrediction] = await Promise.all([
        analyzeSeverity({
          type: disaster.type,
          description: disaster.description || '',
          location: disaster.location_name,
          affectedPopulation: disaster.affected_population || undefined
        }),
        predictResourceNeeds({
          type: disaster.type,
          severity: disaster.severity,
          location: disaster.location_name,
          affectedPopulation: disaster.affected_population || undefined
        })
      ]);

      setAnalysis(prev => ({
        ...prev,
        severity: severityAnalysis,
        resources: resourcePrediction
      }));
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMisinformation = async (reportId: string) => {
    setLoading(true);
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      const misinformationAnalysis = await detectMisinformation({
        title: report.title,
        description: report.description
      });

      setAnalysis(prev => ({
        ...prev,
        misinformation: misinformationAnalysis
      }));
    } catch (error) {
      console.error('Misinformation check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSituationReport = async (disasterId: string) => {
    setLoading(true);
    try {
      const disaster = disasters.find(d => d.id === disasterId);
      if (!disaster) return;

      const relatedReports = reports.filter(r => r.disaster_id === disasterId);
      
      const situationReport = await generateSituationReport({
        location: disaster.location_name,
        timeframe: '24 hours',
        incidents: relatedReports.map(r => ({
          type: r.type,
          description: r.description,
          timestamp: r.created_at
        }))
      });

      setAnalysis(prev => ({
        ...prev,
        situationReport
      }));
    } catch (error) {
      console.error('Situation report generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Analysis Card */}
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">AI Analysis</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.severity && (
                <div className="glass-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Severity Analysis</h3>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{analysis.severity}</p>
                </div>
              )}
              
              {analysis.resources && (
                <div className="glass-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Resource Predictions</h3>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{analysis.resources}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Misinformation Detection Card */}
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Misinformation Detection</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.misinformation && (
                <div className="glass-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Report Analysis</h3>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{analysis.misinformation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Situation Report Card */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">AI-Generated Situation Report</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {analysis.situationReport && (
              <div className="glass-dark p-4 rounded-lg">
                <p className="text-gray-300 text-sm whitespace-pre-line">{analysis.situationReport}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {disasters.map(disaster => (
          <div key={disaster.id} className="flex space-x-2">
            <button
              onClick={() => handleAnalyzeDisaster(disaster.id)}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all hover-lift flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Analyze {disaster.title}</span>
            </button>
            <button
              onClick={() => handleGenerateSituationReport(disaster.id)}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all hover-lift flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}