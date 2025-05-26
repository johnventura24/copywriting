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
        const { originalCopy, numVariations, leadType, medicareBenefit, copyFormat, copywriterStyle } = req.body;
        
        // Validate required fields
        if (!originalCopy) {
            return res.status(400).json({ error: 'Original copy is required' });
        }
        
        // Use server-side API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured on server' });
        }
        
        // Define copy format specifications
        const copyFormatSpecs = {
            'ad-script': 'Ad Script - Write as a spoken advertisement script with natural conversational flow, clear call-to-action, and timing considerations. Include speaker directions if helpful. Aim for 30-60 seconds when read aloud.',
            'video-hook': 'Video Hook - Create attention-grabbing opening lines for video content. Focus on stopping scroll, creating curiosity, and compelling viewers to watch. Keep it punchy and engaging (5-15 seconds when spoken).',
            'ad-headline': 'Ad Copy Headline - Write compelling headlines for display ads, social media ads, or print advertisements. Focus on benefit-driven, attention-grabbing headlines that make people want to read more.',
            'ad-copy-text': 'Ad Copy Text - Write the main body copy for advertisements. Focus on benefits, social proof, and compelling calls-to-action. Keep it scannable and persuasive.',
            'lander-headline': 'Landing Page Headline - Create powerful headlines for landing pages that immediately communicate value and encourage visitors to stay and convert.',
            'google-ads': 'Google Ads Format - Create headlines (30 chars max), long headlines (90 chars max), descriptions (90 chars max), and display URL paths optimized for Google Ads platform.',
            'facebook-ads': 'Facebook Ads Format - Create primary text (125 chars recommended), headlines (40 chars max), descriptions (30 chars max), and call-to-action optimized for Facebook advertising.'
        };
        
        // Define copywriter styles from advertising legends
        const copywriterStyles = {
            'david-ogilvy': {
                name: 'David Ogilvy',
                description: 'The "Father of Advertising" - Known for research-driven, factual copy with compelling headlines',
                style: 'Write in David Ogilvy\'s style: Clear, direct, and persuasive with emphasis on research and data. Use strong headlines, factual benefits, and authoritative tone. Focus on the product\'s unique selling proposition. Include specific details and avoid puffery. Write as if speaking to an intelligent consumer who appreciates honesty and substance.',
                tone: 'Authoritative, professional, rational, emphasizing value and effectiveness'
            },
            'bill-bernbach': {
                name: 'Bill Bernbach',
                description: 'Creative revolutionary - Emotional storytelling with wit and humanity',
                style: 'Write in Bill Bernbach\'s style: Creative, witty, and emotionally engaging. Focus on human insights and breakthrough creative concepts. Use conversational tone, clever wordplay, and unexpected angles. Challenge conventions and connect on an emotional level. Make the ordinary seem extraordinary through fresh perspective.',
                tone: 'Innovative, playful, human-centric, conversational, emotionally engaging'
            },
            'leo-burnett': {
                name: 'Leo Burnett',
                description: 'Creator of iconic characters - Folksy wisdom with memorable storytelling',
                style: 'Write in Leo Burnett\'s style: Use folksy wisdom, memorable characters, and down-to-earth storytelling. Focus on inherent drama in products and human truths. Create copy that feels authentic, warm, and relatable. Use simple language that resonates with everyday people. Build brand personality through consistent character.',
                tone: 'Warm, authentic, folksy, relatable, down-to-earth, memorable'
            },
            'rosser-reeves': {
                name: 'Rosser Reeves',
                description: 'USP pioneer - Single-minded focus on unique selling proposition',
                style: 'Write in Rosser Reeves\' style: Focus on a single, compelling Unique Selling Proposition (USP). Use clear, repetitive reinforcement of one key benefit. Be direct, focused, and emphatic. Avoid cleverness for cleverness sake. Hammer home the main message with unwavering consistency.',
                tone: 'Single-minded, persuasive, focused, emphatic, direct, repetitive'
            },
            'claude-hopkins': {
                name: 'Claude Hopkins',
                description: 'Scientific advertising pioneer - Reason-why copy with measurable results',
                style: 'Write in Claude Hopkins\' style: Use scientific, reason-why approach with specific claims and proof. Focus on measurable benefits and concrete results. Write like a salesperson presenting logical arguments. Include testimonials, guarantees, and specific details. Make every word count toward the sale.',
                tone: 'Scientific, logical, specific, results-focused, persuasive, factual'
            },
            'john-caples': {
                name: 'John Caples',
                description: 'Direct response master - Tested headlines and benefit-driven copy',
                style: 'Write in John Caples\' style: Create benefit-driven headlines and copy that compel immediate action. Use tested formulas and proven psychological triggers. Focus on self-interest and personal gain. Write with urgency and clear calls-to-action. Make the reader feel they\'ll miss out if they don\'t act now.',
                tone: 'Urgent, benefit-focused, action-oriented, compelling, direct'
            },
            'eugene-schwartz': {
                name: 'Eugene Schwartz',
                description: 'Breakthrough advertising - Market sophistication and desire intensification',
                style: 'Write in Eugene Schwartz\'s style: Understand market sophistication levels and intensify existing desires rather than creating new ones. Use psychological insights and deep market awareness. Create copy that acknowledges what the prospect already knows and feels. Build on existing beliefs and desires.',
                tone: 'Psychologically sophisticated, desire-focused, market-aware, insightful'
            },
            'gary-halbert': {
                name: 'Gary Halbert',
                description: 'Direct mail legend - Conversational style with psychological triggers',
                style: 'Write in Gary Halbert\'s style: Use conversational, personal tone as if writing to a friend. Include psychological triggers, storytelling, and emotional appeals. Be bold, sometimes controversial, and always engaging. Use simple language but powerful concepts. Focus on benefits and emotional payoffs.',
                tone: 'Conversational, personal, bold, engaging, emotionally compelling'
            },
            'dan-kennedy': {
                name: 'Dan Kennedy',
                description: 'No B.S. marketer - Direct, controversial, and results-driven',
                style: 'Write in Dan Kennedy\'s style: Be direct, sometimes controversial, and always focused on results. Use no-nonsense language and challenge conventional thinking. Include urgency, scarcity, and strong calls-to-action. Don\'t be afraid to be polarizing if it serves the message.',
                tone: 'Direct, controversial, no-nonsense, results-driven, urgent'
            },
            'joe-sugarman': {
                name: 'Joe Sugarman',
                description: 'Psychological triggers master - Smooth flow and irresistible copy',
                style: 'Write in Joe Sugarman\'s style: Create smooth, flowing copy that\'s easy to read and hard to stop. Use psychological triggers and curiosity gaps. Make each sentence compel reading the next. Focus on the emotional reasons people buy, then justify with logic.',
                tone: 'Smooth, flowing, psychologically compelling, curiosity-driven'
            }
        };
        
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
            'savings': 'Focus on overall savings opportunities and cost reductions.',
            'auto-insurance': 'Focus on auto insurance benefits emphasizing savings, protection, and peace of mind. Use angles like competitive rates, comprehensive coverage, roadside assistance, and financial protection from accidents.',
            'final-expense': 'Focus on final expense insurance with sensitivity and dignity. Emphasize peace of mind, protecting loved ones from financial burden, affordable premiums, and the relief of having arrangements handled. Avoid overly enthusiastic tones - use respectful, caring language.'
        };
        
        const leadDescription = leadDescriptions[leadType] || leadDescriptions['story'];
        const medicareBenefitContext = medicareBenefit ? medicareBenefitContexts[medicareBenefit] : '';
        const copyFormatSpec = copyFormat ? copyFormatSpecs[copyFormat] : '';
        const copywriterStyleSpec = copywriterStyle ? copywriterStyles[copywriterStyle] : null;
        
        let systemPrompt = `You are a professional copywriter expert in advertising leads. ${leadDescription}`;
        
        // Add copywriter style if specified
        if (copywriterStyleSpec) {
            systemPrompt += `\n\nCOPYWRITER STYLE: You are channeling ${copywriterStyleSpec.name}. ${copywriterStyleSpec.style}\nTONE: ${copywriterStyleSpec.tone}`;
        }
        
        if (copyFormatSpec) {
            systemPrompt += `\n\nCOPY FORMAT: ${copyFormatSpec}`;
            
            // Add specific formatting instructions for platform-specific formats
            if (copyFormat === 'google-ads') {
                systemPrompt += `\n\nFORMAT EACH VARIATION AS:\nHeadlines (30 characters max each):\n- Headline 1: [text]\n- Headline 2: [text] \n- Headline 3: [text]\n\nLong Headlines (90 characters max each):\n- Long Headline 1: [text]\n- Long Headline 2: [text]\n\nDescriptions (90 characters max each):\n- Description 1: [text]\n- Description 2: [text]\n- Description 3: [text]\n- Description 4: [text]\n\nDisplay URL Path: [relevant path]`;
            }
            
            if (copyFormat === 'facebook-ads') {
                systemPrompt += `\n\nFORMAT EACH VARIATION AS:\nPrimary Text (125 characters recommended):\n[text]\n\nHeadline (40 characters max):\n[text]\n\nDescription (30 characters max):\n[text]\n\nCall-to-Action:\n[suggested CTA button text]`;
            }
        }
        
        if (medicareBenefitContext) {
            systemPrompt += `\n\nTARGET MARKET FOCUS: ${medicareBenefitContext}
When writing variations, incorporate this target market context naturally into the copy while maintaining the chosen lead type's style.`;
        }
        
        systemPrompt += `\n\nGenerate ${numVariations} different variations of the provided copy using this specific lead type`;
        
        if (copyFormatSpec) {
            systemPrompt += ` in the specified copy format`;
        }
        
        systemPrompt += `. Each variation should be numbered clearly (1., 2., 3., etc.)`;
        
        if (medicareBenefitContext) {
            systemPrompt += `\nNaturally incorporate the target market focus when relevant.`;
        }
        
        if (copyFormatSpec) {
            systemPrompt += `\nEnsure each variation follows the copy format specifications and requirements.`;
        }
        
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