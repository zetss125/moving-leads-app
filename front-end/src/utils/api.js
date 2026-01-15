// src/utils/api.js

const API_BASE_URL =
  import.meta.env.PROD
    ? 'https://moving-leads-app.onrender.com'
    : 'http://localhost:3001';

export async function fetchLeads() {
  const response = await fetch(`${API_BASE_URL}/api/leads`);
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
}

export async function analyzeFacebookToken(token) {
  const response = await fetch(`${API_BASE_URL}/api/analyze-facebook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken: token })
  });

  if (!response.ok) throw new Error('Analysis failed');
  return response.json();
}

export async function deleteLead(id) {
  const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}
