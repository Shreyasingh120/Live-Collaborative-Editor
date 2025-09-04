# Live Collaborative Editor

A modern, AI-powered collaborative text editor built with React.js and TipTap. Features real-time AI assistance, intelligent text editing, and web search capabilities.

## 🚀 Live Demo

**[Try it live: live-collaborative-editor-tan.vercel.app](https://live-collaborative-editor-tan.vercel.app)**

## 🚀 Features

### Core Features
- **Rich Text Editor**: Built with TipTap, supporting formatting, lists, headings, and more
- **AI Chat Sidebar**: Interactive AI assistant for writing help and content generation
- **Floating Toolbar**: Context-aware toolbar that appears on text selection
- **Preview Modal**: Compare original text with AI suggestions before applying changes
- **Real-time Editing**: Smooth editing experience with instant feedback

### AI Capabilities
- **Text Enhancement**: Shorten, lengthen, improve grammar, and enhance clarity
- **Format Conversion**: Convert text to tables and other formats
- **Smart Suggestions**: AI-powered writing assistance
- **Web Search Integration**: Search the web and insert summaries directly into the editor

### Bonus Features
- **LLM Agent**: Advanced AI agent with web search and content crawling
- **Mock API Support**: Works without API keys for demonstration
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Modern Architecture**: Built with React 18, Vite, and modern tooling

## 🛠️ Tech Stack

- **Frontend**: React.js 18 with Hooks
- **Editor**: TipTap (ProseMirror-based)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **AI Integration**: OpenAI API (optional)

## 📦 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd live-collaborative-editor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:3000`

## 🔧 Configuration

### Environment Variables Setup
1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your API keys** (optional):
   ```bash
   # Edit .env file
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SEARCH_API_KEY=your_search_api_key_here
   ```

3. **Available Environment Variables**:
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key for real AI responses
   - `VITE_SEARCH_API_KEY`: API key for web search (Tavily, Serper, etc.)
   - `VITE_DEMO_MODE`: Set to `true` for demo mode with mock responses
   - `VITE_DEBUG_MODE`: Set to `true` to enable debug information
   - `VITE_APP_NAME`: Customize the application name

### Alternative API Setup
You can also set your OpenAI API key through the UI:
1. Click the settings icon in the chat sidebar
2. Enter your OpenAI API key
3. The app will use real AI responses instead of mock data

**Note**: The app works perfectly without any API keys using mock responses for demonstration.

## 🎯 Usage

### Basic Editing
1. Type in the main editor area
2. Use the toolbar for formatting (Bold, Italic, Headers, Lists, etc.)
3. The editor supports all standard rich text features

### AI Text Enhancement
1. **Select any text** in the editor
2. **Floating toolbar appears** with AI options:
   - **Shorten**: Reduce text length while keeping meaning
   - **Lengthen**: Expand text with more details
   - **Grammar**: Fix grammar and spelling errors
   - **To Table**: Convert text to table format
   - **Improve**: Enhance clarity and readability
3. **Preview changes** in the modal before applying
4. **Confirm or cancel** the AI suggestions

### Chat with AI
1. **Open the chat sidebar** (right panel)
2. **Ask questions** or request writing help
3. **Use quick actions** for common tasks
4. **AI responses** can be applied directly to the editor

### Web Search Agent
1. **Click the Bot icon** in the chat sidebar
2. **Enter search queries** to find information
3. **AI generates summaries** of search results
4. **Insert summaries** directly into your document
5. **Crawl URLs** for detailed content extraction

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
# Deploy the dist folder to Vercel
```

### Netlify Deployment
```bash
npm run build
# Deploy the dist folder to Netlify
```

The project includes configuration files for both platforms:
- `vercel.json` for Vercel deployment
- `netlify.toml` for Netlify deployment

## 📁 Project Structure

```
live-collaborative-editor/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Main TipTap editor
│   │   ├── ChatSidebar.jsx     # AI chat interface
│   │   ├── FloatingToolbar.jsx # Text selection toolbar
│   │   ├── PreviewModal.jsx    # AI suggestion preview
│   │   └── Agent.jsx           # Web search agent
│   ├── context/
│   │   └── AIContext.jsx       # AI state management
│   ├── App.jsx                 # Main application
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
└── README.md                 # This file
```

## 🎨 Key Components

### Editor Component
- TipTap-based rich text editor
- Floating toolbar on text selection
- AI integration for text enhancement
- Ref forwarding for external content insertion

### Chat Sidebar
- Real-time AI conversation
- Settings panel for API configuration
- Quick action buttons
- Integration with web search agent

### AI Context
- Centralized AI state management
- Mock responses for demo mode
- OpenAI API integration
- Web search functionality

### Preview Modal
- Side-by-side comparison
- Change statistics
- Confirm/cancel actions
- Responsive design

## 🔮 Future Enhancements

- Real-time collaboration with multiple users
- Document versioning and history
- More AI models support (Claude, Gemini)
- Advanced formatting options
- Plugin system for extensions
- Offline mode support

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies not installing**: Try `npm install --legacy-peer-deps`
2. **Build errors**: Ensure Node.js version 16+ is installed
3. **AI not working**: Check API key configuration or use demo mode
4. **Styling issues**: Verify Tailwind CSS is properly configured

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

This is a test assignment project, but contributions and improvements are welcome!

---

**Built with ❤️ using React.js, TipTap, and modern web technologies**
