import React, { useState, useEffect } from 'react';
import './App.css';

interface Requirement {
  id: number;
  source_table: string;
  target_table: string;
  description?: string;
}

function App() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [sourceTable, setSourceTable] = useState('');
  const [targetTable, setTargetTable] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch requirements from FastAPI backend on load
  const fetchRequirements = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/requirements');
      const data = await response.json();
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // Handle form submission to create a new pipeline requirement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTable || !targetTable) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_table: sourceTable,
          target_table: targetTable,
          description: description,
        }),
      });

      if (response.ok) {
        setSourceTable('');
        setTargetTable('');
        setDescription('');
        fetchRequirements(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating requirement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>DataPilot 🚀</h1>
      <p>Enterprise Data Pipeline Requirement Manager</p>

      {/* Form to add a new requirement */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Add New Pipeline Requirement</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Source Table:</label>
          <input
            type="text"
            value={sourceTable}
            onChange={(e) => setSourceTable(e.target.value)}
            placeholder="e.g., raw_users"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Target Table:</label>
          <input
            type="text"
            value={targetTable}
            onChange={(e) => setTargetTable(e.target.value)}
            placeholder="e.g., dim_users"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Daily sync of user profiles"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save Requirement'}
        </button>
      </form>

      {/* List of saved requirements from SQLite */}
      <h3>Saved Requirements</h3>
      {requirements.length === 0 ? (
        <p>No pipeline requirements found yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {requirements.map((req) => (
            <li key={req.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', marginBottom: '0.75rem', borderRadius: '6px' }}>
              <strong>{req.source_table}</strong> ➡️ <strong>{req.target_table}</strong>
              {req.description && <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>{req.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;