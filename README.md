# AI Copywriting Variation Generator

A desktop application that generates multiple variations of your marketing copy using OpenAI's GPT API.

## Features

- Generate multiple variations of your marketing copy
- Choose between different tones (Professional, Casual, Enthusiastic, Persuasive, Humorous)
- Select the number of variations to generate
- Copy variations to clipboard with a single click
- Saves your API key locally for convenience

## Requirements

- An OpenAI API key (get one at https://platform.openai.com/account/api-keys)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)

### Setup

1. Clone or download this repository
2. Open a terminal and navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```

### Building Distributable

To create a distributable version of the application:

```
npm run make
```

This will create platform-specific distributables in the `out` folder.

## How to Use

1. Launch the application
2. Enter your OpenAI API key
3. Paste or type your original marketing copy in the textarea
4. Select the number of variations you want to generate
5. Choose the desired tone for your variations
6. Click "Generate Variations"
7. View, compare and copy your generated variations

## Privacy

- Your OpenAI API key is stored only in your application's local storage
- No data is sent to any server other than OpenAI's API
- All processing happens locally in your application

## Troubleshooting

If you encounter any issues:

- Make sure your OpenAI API key is valid and has sufficient credits
- Check your internet connection
- Restart the application
- Check console logs (View > Toggle Developer Tools)

## Limitations

- Depends on OpenAI's API availability
- Subject to OpenAI's usage limits and pricing
- Large blocks of text may result in longer processing times

## Customization

You can modify the application by editing:

- `index.html` - Structure and content
- `styles.css` - Visual appearance and layout
- `script.js` - Application logic and API integration 