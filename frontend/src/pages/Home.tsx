import { useState, type JSX } from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import CTASection from "../components/CTASection/CTASection";
import ChatModal from "../components/ChatModal/ChatModal";
import { useTheme } from "../hooks/useTheme";

export default function Home(): JSX.Element {
  const { isDark, toggleTheme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} onTryClick={openChat} />

      <main>
        <Hero onTryClick={openChat} />
        <Features />
        <CTASection onTryClick={openChat} />
      </main>

      <ChatModal isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
}