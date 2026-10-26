// TODO: Testing Git feature branch and PR workflow
import { useState, useEffect } from 'react';
import './App.css';

interface PipelineReq {
  title: string;
  description: string;
  source_table: string;
  target_table: string;
}

function App() {
  // 1. Form state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceTable, setSourceTable] = useState('');
  const [targetTable, setTargetTable] = useState('');
  
  // 2. Feedback and history state variables
  const [responseMessage, setResponseMessage] = useState('');
  const [requirementsList, setRequirementsList] = useState<PipelineReq[]>([]);

  // Function to fetch all submitted pipeline requirements from FastAPI
  const fetchRequirements = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/requirements');
      const data = await res.json();
      if (res.ok) {
        setRequirementsList(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requirements history:', err);
    }
  };

  // Fetch history when the component first loads
  useEffect(() => {
    fetchRequirements();
  }, []);

  // 3. Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      source_table: sourceTable,
      target_table: targetTable,
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponseMessage(`Success! Server says: "${data.message}"`);
        // Clear form fields
        setTitle('');
        setDescription('');
        setSourceTable('');
        setTargetTable('');
        // Refresh history list immediately
        fetchRequirements();
      } else {
        setResponseMessage(`Validation Error: Check your Pydantic fields.`);
      }
    } catch (err) {
      setResponseMessage('Could not connect to backend. Is FastAPI running?');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>DataPilot 🚀</h1>
      <p>AI Data Pipeline Copilot (J&J Learning Simulation)</p>
      
      {/* Pipeline Requirement Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Define Pipeline Requirement</h3>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pipeline Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Supply Chain Sync"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="e.g., Sync daily inventory levels from EU plants"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Source Table:</label>
          <input 
            type="text" 
            value={sourceTable} 
            onChange={(e) => setSourceTable(e.target.value)} 
            placeholder="e.g., raw_inventory_eu"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Target Table:</label>
          <input 
            type="text" 
            value={targetTable} 
            onChange={(e) => setTargetTable(e.target.value)} 
            placeholder="e.g., clean_inventory_warehouse"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Submit Requirement
        </button>
      </form>

      {/* Response Display Box */}
      {responseMessage && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e2f0d9', borderRadius: '8px', color: '#274e13', fontWeight: 'bold' }}>
          {responseMessage}
        </div>
      )}

      {/* Pipeline History Section */}
      <div style={{ marginTop: '40px' }}>
        <h3>Pipeline History Log 📋</h3>
        {requirementsList.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No pipeline requirements submitted yet this session.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {requirementsList.map((req, index) => (
              <div key={index} style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>{req.title}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#444' }}>{req.description}</p>
                <div style={{ fontSize: '13px', background: '#f1f1f1', padding: '6px 10px', borderRadius: '4px', display: 'inline-block' }}>
                  <code>{req.source_table}</code> ➡️ <code>{req.target_table}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;