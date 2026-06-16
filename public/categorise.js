export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}
const { description } = req.body;
if (!description) {
return res.status(400).json({ error: 'Description required' });
}
const categories = [
'Home & rent', 'Groceries', 'Food & dining', 'Transport',
'Entertainment', 'Shopping', 'Health', 'Utilities', 'Household', 'Other'
];
try {
const response = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': process.env.ANTHROPIC_API_KEY,
'anthropic-version': '2023-06-01'
},
body: JSON.stringify({
model: 'claude-haiku-4-5-20251001',
max_tokens: 20,
system: `You categorise expenses for an Indian household called BuBu Chui Enterprises
Reply with ONLY one category from this list, nothing else: ${categories.join(', ')}.
Choose the most relevant category. If unsure, use Other.`,
messages: [{ role: 'user', content: description }]
})
});
const data = await response.json();
const raw = data.content?.[0]?.text?.trim() || 'Other';
const category = categories.find(c =>
raw.toLowerCase().includes(c.toLowerCase())
) || 'Other';
return res.status(200).json({ category });
} catch (error) {
console.error('Categorisation error:', error);
return res.status(200).json({ category: 'Other' });
}
}
