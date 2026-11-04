import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, PageId } from './components/Header';
import { Footer } from './components/Footer';
import { QuotaBanner } from './components/QuotaBanner';
import { CustomCursor } from './components/CustomCursor';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { MonumentDetailPage } from './pages/MonumentDetailPage';
import { MapPage } from './pages/MapPage';
import { ThreeDGalleryPage } from './pages/ThreeDGalleryPage';
import { DigitalArchivePage } from './pages/DigitalArchivePage';
import { ResearchAssistantPage } from './pages/ResearchAssistantPage';

gsap.registerPlugin(ScrollTrigger);

const PAGE_NAMES: Record<PageId, string> = {
  home: 'Home Continuum',
  explore: 'Heritage Catalog',
  monument: 'Architectural Monograph',
  map: 'Geospatial India Map',
  '3d-gallery': '3D Heritage Studio',
  archive: 'Digital Field Archive',
  research: 'AI Heritage Scholar',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeMonumentId, setActiveMonumentId] = useState<string>('rani-ki-vav');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll and wire with GSAP ScrollTrigger
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  const handleNavigate = (page: PageId, monumentId?: string) => {
    if (page === currentPage && monumentId === activeMonumentId) return;

    setIsTransitioning(true);

    setTimeout(() => {
      if (monumentId) {
        setActiveMonumentId(monumentId);
      }
      setCurrentPage(page);

      // Reset scroll position cleanly using Lenis
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }

      // Refresh ScrollTrigger calculations after page transition
      setTimeout(() => {
        ScrollTrigger.refresh();
        setIsTransitioning(false);
      }, 250);
    }, 280);
  };

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] flex flex-col font-sans selection:bg-[#c5a059] selection:text-[#09110d] relative">
      {/* Luxury Gold Trailing Cursor */}
      <CustomCursor />

      {/* Cinematic Transition Curtain */}
      <PageTransitionOverlay
        isTransitioning={isTransitioning}
        pageName={PAGE_NAMES[currentPage] || 'Sanskriti'}
      />

      {/* Google Maps Quota Defense Banner */}
      <QuotaBanner />

      {/* Top Bar Navigation conforming to Top Bar Contract */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'explore' && <ExplorePage onNavigate={handleNavigate} />}
        {currentPage === 'monument' && (
          <MonumentDetailPage
            monumentId={activeMonumentId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'map' && <MapPage onNavigate={handleNavigate} />}
        {currentPage === '3d-gallery' && <ThreeDGalleryPage onNavigate={handleNavigate} />}
        {currentPage === 'archive' && <DigitalArchivePage onNavigate={handleNavigate} />}
        {currentPage === 'research' && <ResearchAssistantPage onNavigate={handleNavigate} />}
      </main>

      {/* Editorial Curatorial Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
