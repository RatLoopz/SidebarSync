# LinkedIn AI Auto Commenter

A powerful Chrome extension that uses AI to generate thoughtful comments on LinkedIn posts with just one click.

![LinkedIn AI Auto Commenter](https://img.shields.io/badge/Chrome-Extension-green?logo=google-chrome)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.1.0-orange)

## ✨ Features

- **AI-Powered Comments**: Generate contextually relevant comments based on the post content
- **Multiple AI Providers**: Support for both OpenAI (GPT) and Google Gemini models
- **Multiple Comment Styles**: Choose between short, long, or emoji-enhanced comments
- **Tone Selection**: Select from various comment tones (Professional, Casual, Supportive, Thoughtful, Enthusiastic)
- **Seamless Integration**: Works directly within LinkedIn's interface
- **Customizable API**: Use your preferred AI service by configuring the API key
- **Smart Extraction**: Accurately extracts post content from LinkedIn's complex DOM structure
- **Modern UI**: Clean, intuitive interface with smooth animations and helpful notifications

## 🚀 Installation

### From Source

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/yourusername/linkedin-ai-auto-commenter.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked" and select the folder where you cloned the repository
5. The extension should now appear in your extensions list and is ready to use!

### From Release

1. Download the extension files from the [Releases](https://github.com/yourusername/linkedin-ai-auto-commenter/releases) page
2. Unzip the downloaded file to a location of your choice
3. Follow steps 2-5 from the "From Source" section above

## 📖 Usage

1. Navigate to any LinkedIn post
2. Click the "Comment" button below the post
3. A toolbar will appear with the following options:
   - **Tone Selector**: Choose the tone of your comment (Professional, Casual, etc.)
   - **Short**: Generate a concise comment
   - **Long**: Generate a more detailed comment
   - **Emoji+**: Generate a comment with relevant emojis
   - **Reset**: Clear the comment field
4. Click any of the comment style buttons to generate an AI-powered comment
5. Review and edit the generated comment as needed before posting

## ⚙️ Configuration

### Setting up your API Key

1. Click the extension icon in your Chrome toolbar
2. Select "Options" from the dropdown menu
3. Choose your preferred AI provider (OpenAI or Google Gemini)
4. Enter your API key in the designated field
5. Select the model you want to use (or use the default)
6. Save your changes

#### OpenAI Setup

1. Sign up or log in to your [OpenAI account](https://platform.openai.com/)
2. Navigate to the API keys section
3. Create a new API key
4. Copy the key and paste it into the extension options

#### Google Gemini Setup

1. Sign up or log in to your [Google AI Studio](https://aistudio.google.com/)
2. Navigate to the API keys section
3. Create a new API key
4. Copy the key and paste it into the extension options

The extension supports both OpenAI and Google Gemini models. Make sure your API key is valid and has sufficient credits for generating comments.

## 🔧 Technical Details

### Components

- **manifest.json**: Extension configuration file
- **content.js**: Handles DOM interaction and UI elements
- **background.js**: Manages API requests and response processing
- **options.html/js**: Provides the options interface for configuration

### Post Content Extraction

The extension uses multiple selectors to accurately extract post content from LinkedIn's complex DOM structure:

1. Primary: Targets the nested span with `dir="ltr"` inside the break-words container
2. Secondary: Tries the innermost span in the break-words container
3. Tertiary: Falls back to the parent span in the break-words container
4. Final: Attempts to extract from any break-words span

### Comment Generation

The extension sends the extracted post content along with the selected style and tone to the configured AI service, which generates an appropriate comment based on these parameters.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add comments to explain complex functionality
- Test your changes thoroughly before submitting
- Ensure all UI elements are responsive and accessible
- Update documentation as needed

### Reporting Issues

When reporting issues, please include:

- Chrome version and OS
- Extension version
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Any error messages from the console

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is an independent project and is not affiliated with, endorsed by, or connected to LinkedIn Corporation. Users are responsible for the content they post and should ensure compliance with LinkedIn's User Agreement and Community Guidelines.

## 🙏 Acknowledgments

- Thanks to the open-source community for various tools and libraries that made this extension possible
- Special thanks to all contributors who have helped improve this project

## 🔧 Troubleshooting

### Common Issues

**Extension not loading properly:**
- Make sure you're using a recent version of Chrome
- Try disabling and re-enabling the extension
- Check for any error messages in the Chrome extension console

**Comments not generating:**
- Verify your API key is correct and has sufficient credits
- Check your internet connection
- Try switching to a different AI model

**Can't find the comment toolbar:**
- Make sure you've clicked on a comment button first
- Try refreshing the LinkedIn page
- Check if the extension is enabled in Chrome extensions

### Debug Mode

To enable debug mode:
1. Right-click the extension icon
2. Select "Inspect popup"
3. In the console, type: `localStorage.setItem('debug', 'true')`
4. Reload the LinkedIn page

This will enable additional logging to help diagnose issues.

## 📞 Support

If you encounter any issues or have suggestions for improvement:

1. Check the [Issues](https://github.com/yourusername/linkedin-ai-auto-commenter/issues) page for known problems
2. Create a new issue if your problem hasn't been reported yet
3. Provide as much detail as possible about the issue, including screenshots if applicable
