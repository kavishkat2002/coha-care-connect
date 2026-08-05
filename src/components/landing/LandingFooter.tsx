import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/shared/Logo";

const columns = [
  {
    title: "Platform",
    items: [
      { label: "AI assistant", to: "/patient/assistant" },
      { label: "Book appointment", to: "/patient/book" },
      { label: "Telemedicine", to: "/patient/telemedicine" },
      { label: "Health timeline", to: "/patient/timeline" },
    ],
  },
  {
    title: "For providers",
    items: [
      { label: "Doctor portal", to: "/doctor" },
      { label: "Hospital portal", to: "/hospital" },
      { label: "Administration", to: "/admin" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            COHA AI supports earlier screening and better coordinated care. It assists clinical
            decisions — it never replaces them.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} COHA AI. AI-assisted assessments are informational and do not
          constitute a medical diagnosis.
        </p>
      </div>
    </footer>
  );
}
