import { useState, type JSX } from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import CTASection from "../components/CTASection/CTASection";
import ChatModal from "../components/ChatModal/ChatModal";
import { useTheme } from "../hooks/useTheme";

/**
 * Home Page Component.
 * Acts as the primary landing page displaying the Navbar, Hero section,
 * Features list, CTA banner, and managing state for the RAG Chat modal.
 *
 * @returns {JSX.Element} The rendered home page view.
 */
export default function Home(): JSX.Element {
  const { isDark, toggleTheme } = useTheme();
  // State to manage visibility of the chatbot modal
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  /** Opens the interactive RAG chat modal. */
  const openChat = (): void => setIsChatOpen(true);

  /** Closes the interactive RAG chat modal. */
  const closeChat = (): void => setIsChatOpen(false);

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