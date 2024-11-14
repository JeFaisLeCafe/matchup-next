import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen max-h-screen min-h-screen">
      <Header />
      <div className="container p-4 mx-auto pb-16 pt-16">{children}</div>
      <BottomNav />
    </main>
  );
}
