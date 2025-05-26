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
        const { originalCopy, numVariations, leadType, medicareBenefit, copyFormat, copywriterStyle, emotionalTrigger, marketSophistication } = req.body;
        
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
            },
            'victor-schwab': {
                name: 'Victor Schwab',
                description: 'How to Write a Good Advertisement - Master of tested advertising principles',
                style: 'Write in Victor Schwab\'s style: Use proven advertising principles and tested formulas. Focus on clear benefits, strong headlines, and logical progression. Emphasize what the product will do for the customer. Use his famous "5 steps" approach: attention, interest, desire, proof, action.',
                tone: 'Systematic, benefit-focused, proven, methodical, results-oriented'
            },
            'maxwell-sackheim': {
                name: 'Maxwell Sackheim',
                description: 'Book-of-the-Month Club creator - Subscription and continuity expert',
                style: 'Write in Maxwell Sackheim\'s style: Master of subscription and continuity offers. Create compelling membership and club appeals. Focus on exclusivity, ongoing value, and community. Use sophisticated language that appeals to educated audiences. Emphasize prestige and intellectual benefits.',
                tone: 'Sophisticated, exclusive, intellectual, prestigious, community-focused'
            },
            'robert-collier': {
                name: 'Robert Collier',
                description: 'The Robert Collier Letter Book - Master of personal, intimate copy',
                style: 'Write in Robert Collier\'s style: Create deeply personal, intimate copy that speaks directly to the reader\'s heart. Use storytelling, personal anecdotes, and emotional appeals. Write as if speaking to one person. Focus on human desires, fears, and aspirations. Make it feel like a personal letter from a friend.',
                tone: 'Personal, intimate, emotional, storytelling, heart-to-heart'
            },
            'frank-dignan': {
                name: 'Frank Dignan',
                description: 'Mail-order pioneer - Practical, no-nonsense direct response',
                style: 'Write in Frank Dignan\'s style: Use practical, no-nonsense direct response copy. Focus on clear value propositions and straightforward benefits. Avoid fancy language - speak plainly and directly. Emphasize practical results and real-world applications. Make offers clear and compelling.',
                tone: 'Practical, straightforward, no-nonsense, clear, value-focused'
            },
            'bruce-barton': {
                name: 'Bruce Barton',
                description: 'The Man Nobody Knows - Inspirational and uplifting copy',
                style: 'Write in Bruce Barton\'s style: Create inspirational, uplifting copy that appeals to higher aspirations. Use positive, optimistic language. Focus on personal growth, achievement, and betterment. Make readers feel they can accomplish great things. Combine inspiration with practical benefits.',
                tone: 'Inspirational, uplifting, optimistic, aspirational, motivational'
            },
            'elmer-wheeler': {
                name: 'Elmer Wheeler',
                description: 'Tested Selling - "Don\'t sell the steak, sell the sizzle"',
                style: 'Write in Elmer Wheeler\'s style: Focus on the "sizzle" - the exciting, appealing aspects rather than dry facts. Use sensory language and emotional appeals. Create excitement and anticipation. Make benefits come alive through vivid descriptions. Emphasize the experience, not just the product.',
                tone: 'Exciting, sensory, vivid, experiential, sizzle-focused'
            },
            'john-e-kennedy': {
                name: 'John E. Kennedy',
                description: 'Reason-why advertising pioneer - "Advertising is salesmanship in print"',
                style: 'Write in John E. Kennedy\'s style: Treat advertising as "salesmanship in print." Use reason-why copy that explains benefits logically. Focus on rational appeals and clear explanations. Provide solid reasons for purchasing. Write like a skilled salesperson making a logical case.',
                tone: 'Logical, rational, explanatory, salesmanlike, reason-focused'
            },
            'helen-lansdowne': {
                name: 'Helen Lansdowne Resor',
                description: 'First female copywriting star - Emotional appeal to women',
                style: 'Write in Helen Lansdowne Resor\'s style: Pioneer of emotional appeals, especially to women. Focus on feelings, relationships, and personal benefits. Use empathy and understanding of human psychology. Create copy that resonates on an emotional level. Understand and speak to women\'s concerns and desires.',
                tone: 'Emotional, empathetic, understanding, relationship-focused, pioneering'
            },
            'fairfax-cone': {
                name: 'Fairfax Cone',
                description: 'Foote, Cone & Belding founder - Clear, honest, persuasive',
                style: 'Write in Fairfax Cone\'s style: Use clear, honest, and persuasive copy. Avoid exaggeration and stick to truthful claims. Focus on genuine benefits and real value. Write with integrity and respect for the audience. Make compelling cases without resorting to hype or false promises.',
                tone: 'Honest, clear, truthful, respectful, integrity-driven'
            }
        };
        
        // Define emotional triggers
        const emotionalTriggers = {
            'curiosity': 'Emotional Trigger - Curiosity: Create intrigue and make readers want to know more. Use phrases like "secret," "hidden," "what they don\'t want you to know," "discovered," "revealed," and "the truth about." Build mystery and make people curious about the outcome or information.',
            'mystery': 'Emotional Trigger - Mystery: Build suspense and intrigue around your offer. Use mysterious language, hint at secrets, create questions in the reader\'s mind. Use phrases like "mysterious," "unknown," "behind the scenes," "insider information," and "what really happens."',
            'fear': 'Emotional Trigger - Fear: Address fears, concerns, and potential negative outcomes. Use fear of missing out, fear of loss, fear of being left behind. Phrases like "don\'t let this happen to you," "avoid this mistake," "protect yourself from," and "before it\'s too late."',
            'urgency': 'Emotional Trigger - Urgency: Create time pressure and immediate action. Use deadlines, limited availability, and scarcity. Phrases like "limited time," "only this week," "don\'t wait," "act now," "before it\'s gone," "last chance," and "expires soon."',
            'excitement': 'Emotional Trigger - Excitement: Generate enthusiasm and positive energy. Use exciting language, exclamation points, and energetic phrases. Words like "amazing," "incredible," "breakthrough," "revolutionary," "game-changing," and "life-changing."',
            'trust': 'Emotional Trigger - Trust: Build credibility and reliability. Use testimonials, guarantees, certifications, and proof. Phrases like "trusted by," "proven results," "guaranteed," "certified," "recommended by experts," and "thousands of satisfied customers."',
            'greed': 'Emotional Trigger - Greed/Desire: Appeal to the desire for more - more money, more success, more benefits. Use phrases like "get more," "maximize your," "increase your," "double your," "unlimited," and "as much as you want."',
            'pride': 'Emotional Trigger - Pride: Appeal to self-image and status. Make readers feel smart, successful, or special. Use phrases like "exclusive," "elite," "for smart people," "you deserve," "join the successful," and "be among the first."',
            'anger': 'Emotional Trigger - Anger/Frustration: Address frustrations and things that make people angry. Channel righteous anger about problems. Use phrases like "sick and tired of," "fed up with," "enough is enough," "stop letting them," and "fight back."',
            'hope': 'Emotional Trigger - Hope: Inspire optimism and positive outcomes. Paint a picture of a better future. Use phrases like "imagine if," "picture this," "finally," "at last," "your dreams," "better life," and "bright future."'
        };
        
        // Define Market Sophistication Levels (Eugene Schwartz's Breakthrough Advertising)
        const marketSophisticationLevels = {
            'stage1': 'Market Sophistication Stage 1 - FIRST TO MARKET: The audience has never seen this type of product/service before. Use direct, simple claims about what the product does. Focus on the main benefit without elaborate explanation. Example: "This product will help you lose weight." Be straightforward and clear about the primary promise.',
            'stage2': 'Market Sophistication Stage 2 - ELABORATED CLAIM: The audience has seen similar products, so you need to elaborate on your benefits. Amplify and enhance your claims with more details, proof, and specifics. Example: "This product will help you lose 30 pounds in 30 days." Add numbers, timeframes, and enhanced promises.',
            'stage3': 'Market Sophistication Stage 3 - MECHANISM: The audience is skeptical of claims, so you must explain HOW your product works. Focus on the unique mechanism, process, or method that makes your product different. Example: "This product uses a unique fat-burning enzyme that..." Explain the science, process, or methodology.',
            'stage4': 'Market Sophistication Stage 4 - NEW MECHANISM: The audience has seen many mechanisms, so you need a breakthrough new mechanism or a fresh angle on how it works. Introduce revolutionary methods, new discoveries, or innovative approaches. Example: "Scientists just discovered this ancient metabolism secret..." Present cutting-edge or newly discovered mechanisms.',
            'stage5': 'Market Sophistication Stage 5 - IDENTIFICATION: The audience is highly sophisticated and skeptical. Focus on identification with the prospect\'s exact situation, feelings, and desires. Acknowledge their sophistication and speak to their specific circumstances. Example: "If you\'re like most people who have tried everything..." Show deep understanding of their journey and current state.'
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
            
            // Auto Insurance Angles
            'auto-save-money': 'Auto Insurance - Save Money Angle: Focus on significant savings, lower premiums, discounts, and cost comparisons. Emphasize how much money they can save compared to their current insurance. Use phrases like "cut your auto insurance costs," "save hundreds," "lower rates," and "affordable coverage."',
            'auto-fomo': 'Auto Insurance - FOMO Angle: Create urgency and fear of missing out on great rates or limited-time offers. Use phrases like "rates going up soon," "limited time offer," "your neighbors are saving," "don\'t wait," and "act now before rates increase."',
            'auto-problem-solution': 'Auto Insurance - Problem-Solution Angle: Address specific auto insurance problems like high rates, poor service, claim denials, or coverage gaps. Present your insurance as the solution. Focus on pain points and how you solve them better than competitors.',
            'auto-peace-of-mind': 'Auto Insurance - Peace of Mind Angle: Emphasize security, protection, reliability, and being covered when accidents happen. Focus on the emotional comfort of having good insurance. Use phrases like "drive with confidence," "protected when it matters," and "reliable coverage."',
            'auto-social-proof': 'Auto Insurance - Social Proof Angle: Use testimonials, reviews, ratings, and customer satisfaction. Mention how many customers you have, awards won, or positive experiences. Focus on trust and reputation in the community.',
            
            // Final Expense Angles
            'final-expense-peace-of-mind': 'Final Expense Insurance - Peace of Mind Angle: Focus on the emotional relief and comfort of having arrangements handled. Emphasize protecting loved ones from financial stress during difficult times. Use respectful, caring language about providing security and peace of mind for families.',
            'final-expense-financial-protection': 'Final Expense Insurance - Financial Protection Angle: Emphasize protecting family from unexpected costs and financial burden. Focus on covering expenses so families can focus on grieving rather than finances. Use dignified language about financial responsibility and family protection.',
            'final-expense-affordable': 'Final Expense Insurance - Affordable Coverage Angle: Highlight low monthly premiums, fixed rates, and accessibility. Emphasize that coverage is affordable for seniors on fixed incomes. Focus on value and how little it costs for significant protection.',
            'final-expense-simple-process': 'Final Expense Insurance - Simple Process Angle: Emphasize easy application, no medical exams, guaranteed acceptance, and quick approval. Focus on removing barriers and making it simple for seniors to get coverage without hassle.',
            'final-expense-family-care': 'Final Expense Insurance - Family Care Angle: Focus on caring for family and not wanting to be a burden. Emphasize the loving act of planning ahead and taking care of final arrangements. Use warm, family-focused language about responsibility and care.'
        };
        
        const leadDescription = leadDescriptions[leadType] || leadDescriptions['story'];
        const medicareBenefitContext = medicareBenefit ? medicareBenefitContexts[medicareBenefit] : '';
        const copyFormatSpec = copyFormat ? copyFormatSpecs[copyFormat] : '';
        const copywriterStyleSpec = copywriterStyle ? copywriterStyles[copywriterStyle] : null;
        const emotionalTriggerSpec = emotionalTrigger ? emotionalTriggers[emotionalTrigger] : null;
        const marketSophisticationSpec = marketSophistication ? marketSophisticationLevels[marketSophistication] : null;
        
        let systemPrompt = `You are a professional copywriter expert in advertising leads. ${leadDescription}`;
        
        // Add copywriter style if specified
        if (copywriterStyleSpec) {
            systemPrompt += `\n\nCOPYWRITER STYLE: You are channeling ${copywriterStyleSpec.name}. ${copywriterStyleSpec.style}\nTONE: ${copywriterStyleSpec.tone}`;
        }
        
        // Add emotional trigger if specified
        if (emotionalTriggerSpec) {
            systemPrompt += `\n\nEMOTIONAL TRIGGER: ${emotionalTriggerSpec}`;
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
        
        if (marketSophisticationSpec) {
            systemPrompt += `\n\nMARKET SOPHISTICATION: ${marketSophisticationSpec}`;
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