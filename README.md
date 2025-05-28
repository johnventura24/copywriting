# AI Copywriting Bot

A powerful web-based tool for generating creative variations of marketing copy using OpenAI's API.

## Features

- **Lead Types**: Story, Proclamation, Secret, Problem-Solution, Promise, Offer (based on George Felton's "Advertising: Concept and Copy")
- **Copywriting Styles**: Direct Response, Emotional, Conversational, Authoritative, Urgency & Scarcity, Benefit-Focused, Storytelling, Social Proof, Curiosity-Driven, Fear-Based, Aspirational, Educational
- **Copy Formats**: Short Form, Long Form, Headlines, Bullet Points, Email Subject Lines, Social Media Posts, Ad Copy, Sales Letter, Landing Page
- **Copywriter Styles**: 15 legendary copywriters including David Ogilvy, Gary Halbert, Dan Kennedy, Eugene Schwartz, Bill Bernbach, Leo Burnett, and more
- **Emotional Triggers**: 15 psychological appeals including Fear, Greed, Curiosity, Urgency, Social Proof, Authority, Scarcity, and more
- **Aggressiveness Slider**: 10 levels from subtle to maximum aggressive
- **Multiple Angles**: Medicare, Auto, Final Expense, and Dollar Amount focuses
- **Research Data Integration**: Include statistics and facts in your copy
- **Copy Management**: Individual copy buttons and copy-all functionality

## How to Use

1. **Set API Key**: Configure your OpenAI API key (stored locally)
2. **Choose Settings**: 
   - Select lead type (how to start your copy)
   - Choose copywriting style (overall approach)
   - Pick copy format (length and structure)
   - Select copywriter style (specific voice)
   - Choose emotional trigger (psychological appeal)
   - Set aggressiveness level (intensity)
   - Pick angle focus (if applicable)
3. **Add Research Data**: Include any statistics or facts you want incorporated
4. **Enter Original Copy**: Paste your base marketing copy
5. **Generate Variations**: Get multiple unique variations instantly
6. **Copy Results**: Use individual copy buttons or copy all variations

## Copy Formats Available

- **Short Form** - Concise, punchy copy under 100 words
- **Long Form** - Detailed, comprehensive copy with full persuasion
- **Headlines** - Attention-grabbing headlines
- **Bullet Points** - Scannable benefit lists
- **Email Subject Lines** - High open-rate subject lines
- **Social Media Posts** - Platform-optimized content
- **Ad Copy** - Paid advertising copy
- **Sales Letter** - Complete sales letters
- **Landing Page** - Landing page copy structure

## Copywriter Styles Available (15 Legends)

- **David Ogilvy** - Research-driven, factual copy
- **Gary Halbert** - Direct, conversational, highly persuasive
- **Dan Kennedy** - No-nonsense, results-focused
- **Eugene Schwartz** - Psychologically sophisticated
- **John Caples** - Tested, proven approaches
- **Claude Hopkins** - Scientific advertising
- **Joe Sugarman** - Storytelling with psychological triggers
- **Robert Collier** - Letter-writing, personal connection
- **Victor Schwab** - Systematic advertising principles
- **Frank Kern** - Casual, conversational with personality
- **Bill Bernbach** - Creative, witty, emotional
- **Leo Burnett** - Folksy wisdom, memorable storytelling
- **Rosser Reeves** - USP-focused, single-minded
- **Maxwell Sackheim** - Subscription/continuity expert
- **Frank Dignan** - Practical direct response

## Emotional Triggers Available

Fear, Greed, Curiosity, Urgency, Social Proof, Authority, Scarcity, Reciprocity, Commitment, Liking, Hope, Pride, Guilt, Anger, Joy

## Angles Available

### Medicare Angles
- OTC Cards / OTC Benefits
- Flex Cards / Flexible Benefits
- Cashback / Part B Giveback
- Dental, Vision, Hearing
- Groceries, Gas Money, Savings

### Auto Angles
- Insurance, Coverage, Rates

### Final Expense Angles
- Burial Insurance, Life Insurance, Coverage

### Dollar Amount Angles
- $50, $100, $150, $200, $250, $300, $400, $500
- $1,000, $1,500, $2,000

## Requirements

- OpenAI API Key (set as environment variable)
- Modern web browser
- Internet connection

## Deployment

This app is designed to be deployed on Render.com with GitHub integration.

### Environment Variables Required:
- `OPENAI_API_KEY` - Your OpenAI API key (starts with sk-)

### Deployment Files:
- `package.json` - Node.js dependencies
- `server.js` - Express server for hosting
- `index.html` - Main application file

### Render.com Setup:
1. Connect your GitHub repository to Render.com
2. Create a new Web Service
3. Set the environment variable `OPENAI_API_KEY` with your OpenAI API key
4. Deploy the service

## Local Setup

1. Clone this repository
2. Set environment variable: `OPENAI_API_KEY=your_api_key_here`
3. Run `npm install`
4. Run `npm start`
5. Open http://localhost:3000
6. Start generating copy variations!

---

Built with HTML, CSS, JavaScript, and OpenAI's API. 