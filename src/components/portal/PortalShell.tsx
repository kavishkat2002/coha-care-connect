import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "@/components/shared/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getSession, signOut, onAuthStateChange, type Session } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export function PortalShell({
  nav,
  portalLabel,
  children,
}: {
  nav: NavItem[];
  portalLabel: string;
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setIsLoading(false);
    });
    const unsubscribe = onAuthStateChange((s) => {
      setSession(s);
      setIsLoading(false);
    });
    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const initials = (session?.name ?? "Guest")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const filteredNav = isLoading 
    ? nav 
    : session 
      ? nav 
      : nav.filter(item => item.label !== "Overview" && item.label !== "Profile" && item.label !== "Appointments" && item.label !== "Health Timeline");

  const links = (
    <nav className="flex flex-col gap-1" aria-label={`${portalLabel} navigation`}>
      {filteredNav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card px-4 py-5 lg:flex">
        <Link to="/" className="px-2">
          <Logo />
        </Link>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {portalLabel}
        </p>
        <div className="mt-2">{links}</div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <SheetTitle className="sr-only">{portalLabel} navigation</SheetTitle>
                <Logo />
                <div className="mt-6">{links}</div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium lg:hidden">MedDoc</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            </Button>
            
            {isLoading ? null : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {session.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">{session.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {session.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      navigate({ to: "/auth" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="ml-2 bg-primary">
                <Link to="/auth">Login as MedDoc member</Link>
              </Button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
