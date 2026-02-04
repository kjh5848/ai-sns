import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, PenSquare, Settings, Share2 } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                        <Share2 className="w-6 h-6" />
                        <span>D-BLOG</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="transition-colors hover:text-primary">Dashboard</Link>
                        <Link href="/posts" className="transition-colors hover:text-primary">Posts</Link>
                        <Link href="/analytics" className="transition-colors hover:text-primary">Analytics</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <PenSquare className="w-4 h-4 mr-2" />
                        Create Post
                    </Button>
                </div>
            </div>
        </nav>
    );
}
