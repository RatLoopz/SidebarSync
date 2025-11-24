# LinkedIn AI Auto Commenter

A powerful Chrome extension that uses AI to generate thoughtful comments on LinkedIn posts with just one click.

![LinkedIn AI Auto Commenter](https://img.shields.io/badge/Chrome-Extension-green?logo=google-chrome)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## ✨ Features

- **AI-Powered Comments**: Generate contextually relevant comments based on the post content
- **Multiple Comment Styles**: Choose between short, long, or emoji-enhanced comments
- **Tone Selection**: Select from various comment tones (Professional, Casual, Supportive, etc.)
- **Seamless Integration**: Works directly within LinkedIn's interface
- **Customizable API**: Use your preferred AI service by configuring the API key
- **Smart Extraction**: Accurately extracts post content from LinkedIn's complex DOM structure

## 🚀 Installation

1. Download the extension files from the [Releases](https://github.com/yourusername/linkedin-ai-auto-commenter/releases) page
2. Unzip the downloaded file to a location of your choice
3. Open Google Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" using the toggle in the top right corner
5. Click "Load unpacked" and select the folder where you unzipped the extension
6. The extension should now appear in your extensions list and is ready to use!

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
3. Enter your API key in the designated field
4. Save your changes

The extension supports various AI services. Make sure your API key is valid and has sufficient credits for generating comments.

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

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is an independent project and is not affiliated with, endorsed by, or connected to LinkedIn Corporation. Users are responsible for the content they post and should ensure compliance with LinkedIn's User Agreement and Community Guidelines.

## 🙏 Acknowledgments

- Thanks to the open-source community for various tools and libraries that made this extension possible
- Special thanks to all contributors who have helped improve this project

## 📞 Support

If you encounter any issues or have suggestions for improvement:

1. Check the [Issues](https://github.com/yourusername/linkedin-ai-auto-commenter/issues) page for known problems
2. Create a new issue if your problem hasn't been reported yet
3. Provide as much detail as possible about the issue, including screenshots if applicable
