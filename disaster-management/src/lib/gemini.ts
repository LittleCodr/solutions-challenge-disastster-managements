import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAboW17yA9ihXLNqnpK6bn-cK6roxqvH2M");

export async function generateChatResponse({
  prompt,
  context
}: {
  prompt: string;
  context: {
    disasters: any[];
    resources: any[];
    teams: any[];
    alerts: any[];
  };
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedContext = `
      You are an AI assistant for a disaster management system. Current situation:

      Active Disasters (${context.disasters.length}):
      ${context.disasters.map(d => `
        • ${d.title}
        - Severity: ${d.severity}/5
        - Location: ${d.location_name}
        - Status: ${d.status}
        - Affected: ${d.affected_population?.toLocaleString() || 'Unknown'} people
      `).join('\n')}

      Resources (${context.resources.length}):
      ${context.resources.map(r => `
        • ${r.name}
        - ${r.quantity} ${r.unit}
        - Status: ${r.status}
        - Location: ${r.location_name}
      `).join('\n')}

      Teams (${context.teams.length}):
      ${context.teams.map(t => `
        • ${t.name}
        - Type: ${t.type}
        - Status: ${t.status}
        - Location: ${t.location_name}
      `).join('\n')}

      Recent Alerts:
      ${context.alerts.filter(a => a.status === 'sent').slice(0, 3).map(a => `
        • ${a.title}
        - Type: ${a.type}
        - Severity: ${a.severity}/5
      `).join('\n')}

      User Question: ${prompt}

      Please provide a clear, concise response based on this data. Include specific numbers and details when relevant.
    `;

    const result = await model.generateContent(formattedContext);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}

export async function analyzeSeverity(disasterData: {
  type: string;
  description: string;
  location: string;
  affectedPopulation?: number;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze this disaster situation and provide:
    1. Severity level (1-5)
    2. Recommended immediate actions
    3. Resource allocation suggestions
    4. Evacuation priority areas

    Disaster details:
    Type: ${disasterData.type}
    Location: ${disasterData.location}
    Description: ${disasterData.description}
    Affected population: ${disasterData.affectedPopulation || 'Unknown'}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function predictResourceNeeds(disasterData: {
  type: string;
  severity: number;
  affectedPopulation?: number;
  location: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Based on this disaster scenario, predict and suggest:
    1. Required medical supplies (quantity and type)
    2. Food and water requirements
    3. Shelter needs
    4. Emergency response team size
    5. Equipment requirements

    Disaster details:
    Type: ${disasterData.type}
    Severity: ${disasterData.severity}
    Location: ${disasterData.location}
    Affected population: ${disasterData.affectedPopulation || 'Unknown'}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function detectMisinformation(report: {
  title: string;
  description: string;
  source?: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze this disaster report for potential misinformation:
    Title: ${report.title}
    Description: ${report.description}
    Source: ${report.source || 'Unknown'}

    Please provide:
    1. Credibility score (0-100%)
    2. Potential red flags
    3. Verification suggestions
    4. Similar confirmed incidents
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateSituationReport(data: {
  incidents: Array<{ type: string; description: string; timestamp: string }>;
  location: string;
  timeframe: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Generate a comprehensive situation report based on these incidents:
    Location: ${data.location}
    Timeframe: ${data.timeframe}

    Incidents:
    ${data.incidents.map(i => `
      Type: ${i.type}
      Time: ${i.timestamp}
      Description: ${i.description}
    `).join('\n')}

    Please provide:
    1. Executive summary
    2. Key developments
    3. Current challenges
    4. Resource status
    5. Recommended actions
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}