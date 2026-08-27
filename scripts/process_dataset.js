import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic CSV parser to avoid adding dependencies
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Quick and dirty CSV split that handles quotes
    const values = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\,]+)/g);
    if (!values) continue;
    
    const obj = {};
    headers.forEach((h, index) => {
      let val = values[index] ? values[index].trim() : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      obj[h] = val;
    });
    result.push(obj);
  }
  return result;
}

const csvPath = path.join(__dirname, 'public', 'healthcare_dataset.csv');
console.log('Reading CSV...');
const csvData = fs.readFileSync(csvPath, 'utf-8');

console.log('Parsing CSV...');
const records = parseCSV(csvData);

console.log(`Parsed ${records.length} records.`);

// We want to map: Medical Condition -> Best Doctors & Hospitals
const conditionMap = {};

records.forEach(r => {
  const condition = r['Medical Condition'];
  const doctor = r['Doctor'];
  const hospital = r['Hospital'];
  
  if (!condition || !doctor || !hospital) return;
  
  if (!conditionMap[condition]) {
    conditionMap[condition] = {
      doctors: {},
      hospitals: {}
    };
  }
  
  conditionMap[condition].doctors[doctor] = (conditionMap[condition].doctors[doctor] || 0) + 1;
  conditionMap[condition].hospitals[hospital] = (conditionMap[condition].hospitals[hospital] || 0) + 1;
});

// Sort and format output
const aiKnowledge = {};

Object.keys(conditionMap).forEach(cond => {
  const topDoctors = Object.entries(conditionMap[cond].doctors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(d => ({ name: d[0], count: d[1] }));
    
  const topHospitals = Object.entries(conditionMap[cond].hospitals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(h => ({ name: h[0], count: h[1] }));
    
  aiKnowledge[cond] = {
    doctors: topDoctors,
    hospitals: topHospitals
  };
});

const outputPath = path.join(__dirname, 'src', 'data', 'ai_knowledge.json');
fs.writeFileSync(outputPath, JSON.stringify(aiKnowledge, null, 2));

console.log(`Generated knowledge base with ${Object.keys(aiKnowledge).length} conditions at ${outputPath}`);
