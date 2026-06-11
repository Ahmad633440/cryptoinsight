import Navbar from "@/components/layout/Navbar";
import ChatbotFAB from "@/components/layout/ChatbotFAB";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Navbar />
      <main className="flex-1 flex flex-col w-full min-w-0">
        {children}
      </main>
      <ChatbotFAB />
    </div>
  );
}
