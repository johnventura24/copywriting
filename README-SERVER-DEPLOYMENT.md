# Deploying AI Copywriting Bot (Node.js Server) to Render.com

This guide will walk you through deploying your AI Copywriting Bot as a **Node.js web service** to Render.com with **secure server-side API key management**.

## 🔐 Why This Approach is Better

- ✅ **API Key Security**: Your OpenAI API key is stored securely on the server, never exposed to users
- ✅ **No Client-Side API Management**: Users don't need to enter or manage API keys
- ✅ **Professional Setup**: Server-side processing like production applications
- ✅ **Environment Variables**: Proper configuration management through Render dashboard

## Prerequisites

1. A GitHub account
2. A Render.com account (free tier available)
3. An OpenAI API key
4. Your code pushed to a GitHub repository

## Project Structure

Your project now includes:
```
├── server.js              # Express server with API endpoints
├── package.json           # Node.js dependencies and scripts
├── public/
│   └── index.html         # Client-side application
├── render.yaml            # Render configuration for Node.js service
├── .env                   # Local environment variables (not deployed)
└── .gitignore             # Excludes .env from version control
```

## Step-by-Step Deployment Instructions

### 1. Install Dependencies Locally (Optional)

To test locally before deploying:

```bash
npm install
```

### 2. Test Locally (Optional)

1. Create a `.env` file in your project root:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   NODE_ENV=development
   PORT=3000
   ```

2. Start the server:
   ```bash
   npm run server
   ```

3. Open http://localhost:3000 in your browser

### 3. Push to GitHub

1. Make sure your `.env` file is in `.gitignore` (it already is)
2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add Node.js server with secure API key management"
   git push origin main
   ```

### 4. Deploy on Render.com

1. **Sign up/Login to Render.com**
   - Go to [render.com](https://render.com)
   - Sign up for a free account or login

2. **Create New Web Service**
   - Click "New +" in the top right
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository

3. **Configure Deployment**
   - **Name**: `ai-copywriting-bot` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `npm install` (auto-detected)
   - **Start Command**: `npm run server` (auto-detected)

4. **Set Environment Variables**
   
   **CRITICAL STEP**: Before deploying, add your environment variables:
   
   - Scroll down to "Environment Variables"
   - Add the following variables:
     
     | Key | Value |
     |-----|-------|
     | `NODE_ENV` | `production` |
     | `OPENAI_API_KEY` | `your_actual_openai_api_key_here` |
     | `OPENAI_MODEL` | `gpt-3.5-turbo` |
     | `PORT` | `3000` |

   ⚠️ **Important**: Replace `your_actual_openai_api_key_here` with your real OpenAI API key

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - You'll get a URL like `https://your-app-name.onrender.com`

### 5. Verify Deployment

1. Visit your deployed URL
2. Check the server status indicator at the top:
   - 🟢 Green: "Server ready - API key configured" = ✅ Working correctly
   - 🔴 Red: "Server ready - API key not configured" = ❌ Check environment variables
   - 🔴 Red: "Server not available" = ❌ Check deployment logs

3. Test generating variations with sample copy

## Environment Variables Management

### In Render Dashboard

1. Go to your service dashboard
2. Click "Environment" tab
3. Add/edit environment variables
4. Click "Save Changes"
5. Your service will automatically redeploy

### Security Best Practices

- ✅ **Never commit API keys to Git**
- ✅ **Use Render's environment variables**
- ✅ **Regularly rotate your API keys**
- ✅ **Monitor API usage in OpenAI dashboard**

## Troubleshooting

### Common Issues

1. **"Server ready - API key not configured"**
   - Check that `OPENAI_API_KEY` is set in Render environment variables
   - Verify the API key is valid in OpenAI dashboard
   - Redeploy after adding environment variables

2. **"Server not available"**
   - Check deployment logs in Render dashboard
   - Verify `package.json` has correct dependencies
   - Check that `npm run server` command works

3. **API calls failing**
   - Verify OpenAI API key has sufficient credits
   - Check OpenAI API status
   - Review server logs for detailed error messages

### Viewing Logs

1. Go to your Render service dashboard
2. Click "Logs" tab
3. View real-time server logs
4. Look for error messages or API call failures

## Features Included

- ✅ **Secure API Key Management**: Server-side only
- ✅ **Multiple Lead Types**: Story, Proclamation, Secret, etc.
- ✅ **Medicare Benefit Targeting**: OTC Cards, Dental, Vision, etc.
- ✅ **Variable Generation Counts**: 3, 5, or 10 variations
- ✅ **Copy to Clipboard**: Individual and bulk copy
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Server Status Monitoring**: Real-time health checks
- ✅ **Professional UI**: Clean, modern interface

## Cost Breakdown

### Render.com
- **Free Tier**: 750 hours/month (enough for personal use)
- **Paid Plans**: Start at $7/month for always-on service

### OpenAI API
- **GPT-3.5-turbo**: ~$0.01-0.05 per generation
- **Typical Usage**: $5-20/month for moderate use

## Scaling Considerations

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- 750 hours/month limit
- Slower cold starts

### Upgrading Benefits
- Always-on service (no sleeping)
- Faster performance
- Custom domains
- More concurrent users

## Next Steps After Deployment

1. **Test thoroughly** with various copy types
2. **Monitor usage** in OpenAI dashboard
3. **Set up monitoring** for API costs
4. **Consider custom domain** for professional use
5. **Add user authentication** if needed for team use

## Support

If you encounter issues:

1. **Check Render Logs**: Service dashboard → Logs tab
2. **Verify Environment Variables**: Service dashboard → Environment tab
3. **Test API Key**: Use OpenAI playground to verify key works
4. **Review Documentation**: [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)

## Security Notes

- Your API key is now secure on the server
- Users cannot access or modify the API key
- All API calls are proxied through your server
- Environment variables are encrypted at rest on Render

🎉 **Your AI Copywriting Bot is now deployed with enterprise-level security!** 