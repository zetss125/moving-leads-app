// API utilities
const API_BASE_URL = 'http://localhost:3001';

export async function fetchLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function analyzeFacebookToken(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-facebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: token })
    });
    
    if (!response.ok) throw new Error('Analysis failed');
    return await response.json();
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error;
  }
}

export async function deleteLead(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Delete Error:', error);
    throw error;
  }
}