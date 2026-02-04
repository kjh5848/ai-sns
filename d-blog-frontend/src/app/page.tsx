import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart3,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
  Plus,
  TrendingUp,
  Twitter
} from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here's what's happening with your social channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Check Schedule
          </Button>
          <Button size="sm" className="shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagement</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-green-500 font-medium">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Posts</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">6 posts for today</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Channels</CardTitle>
            <BarChart3 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comments</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Main Content: Recent Activity */}
        <Card className="md:col-span-4 border-none bg-accent/20">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest posts and their performance across channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {/* Placeholder for post image */}
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Delicious pasta lunch special for today! 🍝</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • Meta, X, LinkedIn</p>
                </div>
                <div className="flex gap-2">
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <Instagram className="w-4 h-4 text-pink-500" />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground">View all activities</Button>
          </CardContent>
        </Card>

        {/* Sidebar: Social Channels */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Connected Channels</CardTitle>
            <CardDescription>Accounts linked to this D-Blog workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10"><Facebook className="w-5 h-5 text-blue-500" /></div>
                <div>
                  <p className="text-sm font-medium">Pasta Place FB</p>
                  <p className="text-xs text-muted-foreground">Page Admin</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-pink-500/10"><Instagram className="w-5 h-5 text-pink-500" /></div>
                <div>
                  <p className="text-sm font-medium">pastaplace_official</p>
                  <p className="text-xs text-muted-foreground">Business Account</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-sky-500/10"><Twitter className="w-5 h-5 text-sky-400" /></div>
                <div>
                  <p className="text-sm font-medium">@PastaPlace</p>
                  <p className="text-xs text-muted-foreground">Disconnected</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              Connect New Channel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
