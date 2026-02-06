import { FileCode2, Sparkles, Folder, Terminal, CheckCircle2, Layout, Plus, FileText, Share2, MonitorPlay } from "lucide-react";

export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases", hasDropdown: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Resources", href: "#resources", hasDropdown: true },
];

export const FOOTER_LINKS = {
  primary: [
    { label: "Download", href: "#" },
    { label: "Product", href: "#" },
    { label: "Docs", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Releases", href: "#" },
  ],
  secondary: [
    { label: "Blog", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Use Cases", href: "#" },
  ]
};

export const FEATURES = [
  {
    title: "An AI IDE Core",
    description: "Google Antigravity's Editor view offers tab autocompletion, natural language code commands, and a configurable, and context-aware configurable agent.",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" // Placeholder
  },
  {
    title: "Higher-level Abstractions",
    description: "A more intuitive task-based approach to monitoring agent activity, presenting you with essential artifacts and verification results to build trust.",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" // Placeholder
  },
  {
    title: "Cross-surface Agents",
    description: "Synchronized agentic control across your editor, terminal, and browser for powerful development workflows.",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" // Placeholder
  }
];

export const USE_CASES = [
  {
    role: "Frontend developer",
    description: "Streamline UX development by leveraging browser-in-the-loop agents to automate repetitive tasks.",
    image: "https://picsum.photos/800/600?random=1"
  },
  {
    role: "Full stack developer",
    description: "Build production-ready applications with confidence with thoroughly designed artifacts and comprehensive verification tests.",
    image: "https://picsum.photos/800/600?random=2"
  },
  {
    role: "Enterprise developer",
    description: "Streamline operations and reduce context switching by orchestrating agents across workspaces using the Agent Manager.",
    image: "https://picsum.photos/800/600?random=3"
  }
];

export const BLOGS = [
  {
    title: "Gemini 3 Flash in Google Antigravity",
    date: "Dec 18, 2025",
    category: "Product",
    image: "https://picsum.photos/400/400?random=4"
  },
  {
    title: "Nano Banana Pro in Google Antigravity",
    date: "Nov 21, 2025",
    category: "Product",
    image: "https://picsum.photos/400/400?random=5"
  },
  {
    title: "Introducing Google Antigravity",
    date: "Nov 19, 2025",
    category: "Product",
    image: "https://picsum.photos/400/400?random=6"
  }
];

export const ICONS_LIST = [
  { Icon: FileCode2, label: "Code" },
  { Icon: Sparkles, label: "AI" },
  { Icon: Folder, label: "Project" },
  { Icon: Terminal, label: "Terminal" },
  { Icon: CheckCircle2, label: "Test" },
  { Icon: Layout, label: "Layout" },
  { Icon: Plus, label: "New" },
  { Icon: FileText, label: "Docs" },
  { Icon: Share2, label: "Share" },
  { Icon: MonitorPlay, label: "Debug" },
  // Duplicate for density
  { Icon: FileCode2, label: "Code" },
  { Icon: Sparkles, label: "AI" },
  { Icon: Folder, label: "Project" },
  { Icon: Terminal, label: "Terminal" },
  { Icon: CheckCircle2, label: "Test" },
  { Icon: Layout, label: "Layout" },
  { Icon: Plus, label: "New" },
  { Icon: FileText, label: "Docs" },
  { Icon: Share2, label: "Share" },
  { Icon: MonitorPlay, label: "Debug" },
];