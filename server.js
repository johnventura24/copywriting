const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for generating variations
app.post('/api/generate-variations', async (req, res) => {
    try {
        const { originalCopy, numVariations, leadType, medicareBenefit } = req.body;
        
        // Validate required fields
        if (!originalCopy) {
            return res.status(400).json({ error: 'Original copy is required' });
        }
        
        // Use server-side API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured on server' });
        }
        
        // Define lead type descriptions
        const leadDescriptions = {
            'story': 'Story Lead - Start with a narrative, anecdote, or scenario that draws readers in emotionally before connecting to the product/service.',
            'proclamation': 'Proclamation Lead - Make a bold, confident statement or declaration about the product/service.',
            'secret': 'Secret Lead - Reveal insider information, hidden knowledge, or exclusive insights.',
            'problem-solution': 'Problem-Solution Lead - Identify a specific problem your audience faces, then present your product/service as the solution.',
            'promise': 'Promise Lead - Make a compelling promise about what the product/service will deliver.',
            'offer': 'Offer Lead - Lead with a specific deal, discount, bonus, or limited-time offer.'
        };
        
        // Define Medicare benefit contexts
        const medicareBenefitContexts = {
            'otc-cards': 'Focus on Over-the-Counter (OTC) benefits and cards that help cover everyday health items.',
            'flex-cards': 'Emphasize flexible spending benefits and cards that can be used for various health-related expenses.',
            'cashback': 'Highlight Part B premium giveback benefits and cashback opportunities.',
            'dental': 'Focus on dental coverage benefits, including cleanings, fillings, and other dental care.',
            'vision': 'Emphasize vision benefits including eye exams, glasses, contacts, and other vision care.',
            'hearing': 'Highlight hearing aid benefits and hearing care services.',
            'groceries': 'Focus on grocery benefits and allowances that help save money on food.',
            'gas-money': 'Emphasize transportation benefits and gas allowances.',
            'savings': 'Focus on overall savings opportunities and cost reductions.'
        };
        
        const leadDescription = leadDescriptions[leadType] || leadDescriptions['story'];
        const medicareBenefitContext = medicareBenefit ? medicareBenefitContexts[medicareBenefit] : '';
        
        let systemPrompt = `You are a professional copywriter expert in advertising leads. ${leadDescription}`;
        
        if (medicareBenefitContext) {
            systemPrompt += `\n\nMEDICARE BENEFIT FOCUS: ${medicareBenefitContext}`;
        }
        
        systemPrompt += `\n\nGenerate ${numVariations} different variations of the provided copy using this specific lead type. Each variation should be numbered clearly (1., 2., 3., etc.)`;
        
        // Make API call to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Original copy: ${originalCopy}`
                    }
                ],
                temperature: 0.8,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate variations');
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse variations
        const regex = /\d+\.\s+/;
        const parts = content.split(regex).filter(part => part.trim() !== '');
        
        if (parts.length < numVariations) {
            const lineBreakParts = content.split('\n\n').filter(part => part.trim() !== '');
            if (lineBreakParts.length >= numVariations) {
                return res.json({ variations: lineBreakParts.slice(0, numVariations) });
            }
            return res.json({ variations: [content] });
        }
        
        res.json({ variations: parts.slice(0, numVariations) });
        
    } catch (error) {
        console.error('Error generating variations:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apiKeyConfigured: !!process.env.OPENAI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Copywriting Bot server running on port ${PORT}`);
    console.log(`📝 API Key configured: ${!!process.env.OPENAI_API_KEY}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
}); 