import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MONUMENTS, Monument } from '../data/monuments';
import { PageId } from '../components/Header';
import {
  Compass,
  ArrowRight,
  MapPin,
  Box,
  FolderArchive,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  Calendar,
  ExternalLink,
  Sun,
  Activity
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Pinned Hero refs
  const heroPinRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroKickerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroIndicatorRef = useRef<HTMLDivElement>(null);
  const heroPortalRef = useRef<HTMLDivElement>(null);

  // 2. Pinned Storytelling refs
  const storyPinRef = useRef<HTMLDivElement>(null);
  const storyProgressRef = useRef<HTMLDivElement>(null);
  const storySunGnomonRef = useRef<HTMLDivElement>(null);
  const [activeStoryChapter, setActiveStoryChapter] = useState(1);

  // 3. Horizontal Scroll Gallery refs
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const horizontalProgressRef = useRef<HTMLDivElement>(null);

  // 4. Parallax Section refs
  const mandalaBgRef = useRef<SVGSVGElement>(null);

  // Mouse tilt for hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroMonuments = [MONUMENTS[0], MONUMENTS[1], MONUMENTS[3]]; // Rani ki Vav, Taj Mahal, Konark
  const currentHero = heroMonuments[activeHeroIndex];

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 24;
    const y = (clientY / height - 0.5) * 24;
    setMousePos({ x, y });
  };

  useEffect(() => {
    // Refresh ScrollTrigger after assets settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;

      // =========================================================================
      // 1. PINNED CINEMATIC HERO WITH SCROLL-CONTROLLED ZOOM & TEXT EXPANSION
      // =========================================================================
      if (heroPinRef.current && isDesktop) {
        const heroScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Background zoom & brightness grade
        if (heroBgRef.current) {
          heroScrollTl.to(
            heroBgRef.current,
            {
              scale: 1.38,
              filter: 'brightness(0.38) contrast(1.15)',
              ease: 'none',
            },
            0
          );
        }

        // Title typography expansion & subtle upward float
        if (heroTitleRef.current) {
          heroScrollTl.to(
            heroTitleRef.current,
            {
              scale: 1.25,
              letterSpacing: '0.3em',
              y: -50,
              opacity: 0.12,
              ease: 'power1.inOut',
            },
            0.05
          );
        }

        // Subtitle, kicker and card fade away
        if (heroKickerRef.current && heroSubRef.current) {
          heroScrollTl.to(
            [heroKickerRef.current, heroSubRef.current],
            {
              y: -40,
              opacity: 0,
              ease: 'power1.inOut',
            },
            0.05
          );
        }

        if (heroCardRef.current) {
          heroScrollTl.to(
            heroCardRef.current,
            {
              y: 70,
              scale: 0.9,
              opacity: 0,
              ease: 'power1.inOut',
            },
            0.15
          );
        }

        if (heroCtasRef.current) {
          heroScrollTl.to(
            heroCtasRef.current,
            {
              opacity: 0,
              y: 30,
              ease: 'power1.inOut',
            },
            0.1
          );
        }

        if (heroIndicatorRef.current) {
          heroScrollTl.to(
            heroIndicatorRef.current,
            {
              opacity: 0,
              y: 10,
              ease: 'none',
            },
            0
          );
        }

        // Reveal the Portal Gate Callout near the end of the hero pin
        if (heroPortalRef.current) {
          heroScrollTl.fromTo(
            heroPortalRef.current,
            { opacity: 0, scale: 0.85, y: 40 },
            { opacity: 1, scale: 1, y: 0, ease: 'power2.out' },
            0.6
          );
        }
      }

      // Initial Entrance Animation for Hero Typography on Load
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (heroTitleRef.current) {
        const chars = heroTitleRef.current.querySelectorAll('.char');
        entranceTl.fromTo(
          chars,
          { opacity: 0, y: 45, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 1.1 },
          0.1
        );
      }

      // =========================================================================
      // 2. PINNED SCROLL-DRIVEN STORYTELLING CHAPTERS (DYNAMIC TRANSFORMATIONS)
      // =========================================================================
      if (storyPinRef.current) {
        const chapters = storyPinRef.current.querySelectorAll('.story-chapter');
        const images = storyPinRef.current.querySelectorAll('.story-image-card');

        const storyTl = gsap.timeline({
          scrollTrigger: {
            trigger: storyPinRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress < 0.35) {
                setActiveStoryChapter(1);
              } else if (self.progress < 0.7) {
                setActiveStoryChapter(2);
              } else {
                setActiveStoryChapter(3);
              }
            },
          },
        });

        // Vertical Progress Track scrub
        if (storyProgressRef.current) {
          storyTl.fromTo(
            storyProgressRef.current,
            { scaleY: 0 },
            { scaleY: 1, ease: 'none' },
            0
          );
        }

        // Chapter 1: Rani ki Vav (Active initially, transforms to Chapter 2)
        // Image 1 transforms: clipPath inset and slight skew rotation
        storyTl.to(
          images[0],
          {
            scale: 0.9,
            rotate: -2,
            opacity: 0,
            clipPath: 'polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%)',
            ease: 'power2.inOut',
          },
          0.8
        );
        storyTl.to(chapters[0], { opacity: 0, y: -40, ease: 'power2.inOut' }, 0.8);

        // Chapter 2: Konark Sun Temple Entrance (Expanding circle mask & rotation)
        storyTl.fromTo(
          chapters[1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          1.1
        );
        storyTl.fromTo(
          images[1],
          {
            opacity: 0,
            scale: 1.18,
            clipPath: 'circle(15% at 50% 50%)',
          },
          {
            opacity: 1,
            scale: 1.0,
            clipPath: 'circle(75% at 50% 50%)',
            ease: 'power2.out',
          },
          1.1
        );

        // Rotating Sun Gnomon during Chapter 2 scrub
        if (storySunGnomonRef.current) {
          storyTl.fromTo(
            storySunGnomonRef.current,
            { rotation: 0, opacity: 0.2 },
            { rotation: 180, opacity: 0.8, ease: 'none' },
            1.1
          );
        }

        // Chapter 2 -> Chapter 3 Transition
        storyTl.to(
          images[1],
          {
            scale: 0.92,
            rotate: 2,
            opacity: 0,
            clipPath: 'polygon(0% 0%, 100% 15%, 100% 100%, 0% 85%)',
            ease: 'power2.inOut',
          },
          2.0
        );
        storyTl.to(chapters[1], { opacity: 0, y: -40, ease: 'power2.inOut' }, 2.0);

        // Chapter 3: Hampi Entrance (Pillar slit expansion)
        storyTl.fromTo(
          chapters[2],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          2.3
        );
        storyTl.fromTo(
          images[2],
          {
            opacity: 0,
            scale: 1.15,
            clipPath: 'inset(0% 30% 0% 30% round 4px)',
          },
          {
            opacity: 1,
            scale: 1.0,
            clipPath: 'inset(0% 0% 0% 0% round 2px)',
            ease: 'power2.out',
          },
          2.3
        );
      }

      // =========================================================================
      // 3. HORIZONTAL SCROLL MONUMENT GALLERY PINNED (WITH INNER CARD PARALLAX)
      // =========================================================================
      if (horizontalSectionRef.current && horizontalTrackRef.current && isDesktop) {
        const track = horizontalTrackRef.current;
        const totalWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScroll = -(totalWidth - viewportWidth + 120);

        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth * 0.95}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Horizontal translation
        horizontalTl.to(track, {
          x: maxScroll,
          ease: 'none',
        });

        // Progress bar indicator
        if (horizontalProgressRef.current) {
          horizontalTl.fromTo(
            horizontalProgressRef.current,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none' },
            0
          );
        }

        // Inner image parallax inside each card
        const cardImgs = track.querySelectorAll('.card-inner-img');
        cardImgs.forEach((img) => {
          horizontalTl.fromTo(
            img,
            { xPercent: -12 },
            { xPercent: 12, ease: 'none' },
            0
          );
        });
      }

      // =========================================================================
      // 4. PARALLAX MANDALA ROTATION & MULTI-LAYER SPEED OFFSETS
      // =========================================================================
      if (mandalaBgRef.current) {
        gsap.to(mandalaBgRef.current, {
          rotation: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: mandalaBgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.parallax-layer').forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed') || '0.2');
        gsap.to(layer, {
          y: () => -120 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Scroll-based image reveals for grid cards
      gsap.utils.toArray<HTMLElement>('.scroll-reveal-box').forEach((box) => {
        gsap.fromTo(
          box,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            scale: 1.08,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1.0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: box,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#09110d] text-[#f7f3eb] overflow-hidden">
      {/* =====================================================================
          1. PINNED CINEMATIC HERO (SCROLL-CONTROLLED ZOOM & TEXT ANIMATION)
         ===================================================================== */}
      <div ref={heroPinRef} className="relative w-full overflow-hidden">
        <section
          onMouseMove={handleHeroMouseMove}
          className="relative h-screen min-h-[680px] w-full flex items-center justify-center overflow-hidden border-b border-[#c5a059]/20"
        >
          {/* Background authentic photograph with scroll zoom + subtle mouse parallax */}
          <div
            className="absolute inset-0 z-0 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translate3d(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px, 0) scale(1.05)`,
            }}
          >
            <img
              ref={heroBgRef}
              src={currentHero.heroImage.url}
              alt={currentHero.name}
              className="w-full h-full object-cover transition-all duration-700 brightness-80 contrast-105 will-change-transform"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (currentHero.heroImage.fallbackUrl && e.currentTarget.src !== currentHero.heroImage.fallbackUrl) {
                  e.currentTarget.src = currentHero.heroImage.fallbackUrl;
                }
              }}
            />
            {/* Multi-tier atmospheric lighting gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09110d] via-[#09110d]/45 to-[#09110d]/35" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09110d_95%)]" />
          </div>

          {/* Hero Content (Reacts to Scroll Progress) */}
          <div
            ref={heroContentRef}
            className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-7 pt-4 will-change-transform"
          >
            {/* Subtle editorial kicker */}
            <div
              ref={heroKickerRef}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-[#c5a059] uppercase"
            >
              <span>Living Digital Heritage Archive</span>
              <span aria-hidden="true">·</span>
              <span>Scroll-Driven Odyssey</span>
            </div>

            {/* Large Split-Typography SANSKRITI Logo */}
            <div className="space-y-3">
              <h1
                ref={heroTitleRef}
                className="text-5xl sm:text-7xl md:text-8xl font-cinzel font-extrabold tracking-[0.18em] text-[#f7f3eb] drop-shadow-2xl flex items-center justify-center gap-1 sm:gap-3 flex-wrap will-change-transform"
              >
                {'SANSKRITI'.split('').map((char, index) => (
                  <span key={index} className="char inline-block will-change-transform">
                    {char}
                  </span>
                ))}
              </h1>
              <p
                ref={heroSubRef}
                className="text-lg sm:text-xl md:text-2xl font-editorial italic text-[#e4dbcd] max-w-3xl mx-auto leading-relaxed will-change-transform"
              >
                Preserving the sacred geometry, subterranean sanctuaries, and monolithic stone epics of India’s living civilisation.
              </p>
            </div>

            {/* Featured Monument Floating Glass Dossier */}
            <div
              ref={heroCardRef}
              className="max-w-xl mx-auto bg-[#101c15]/85 backdrop-blur-md border border-[#c5a059]/30 p-4 sm:p-5 rounded-sm text-left transition-all shadow-[0_12px_40px_rgba(0,0,0,0.5)] will-change-transform hover-trigger"
              style={{
                transform: `translate3d(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px, 0)`,
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#9eb0a5] pb-2 border-b border-[#c5a059]/15">
                <span className="font-semibold text-[#c5a059] uppercase tracking-wider">
                  Featured Node {activeHeroIndex + 1} of {heroMonuments.length}
                </span>
                <span className="font-mono-tabular">{currentHero.century}</span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-[#f7f3eb]">
                    {currentHero.name}
                  </h2>
                  <p className="text-xs text-[#a7b9ad] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>{currentHero.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentHero.dynasty}</span>
                  </p>
                  <p className="text-xs text-[#d3ded7] mt-2 line-clamp-2 font-editorial text-sm">
                    {currentHero.summary}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('monument', currentHero.id)}
                  className="shrink-0 p-2.5 bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] rounded-sm transition-transform hover:scale-105 cursor-pointer mt-1 shadow-md"
                  title="Examine Monument Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 pt-2 border-t border-[#c5a059]/10 text-[11px] text-[#7d8f84] flex items-center justify-between">
                <span>Authentic Photo: {currentHero.heroImage.photographer}</span>
                <span className="text-[#a5b6ab]">{currentHero.heroImage.license}</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div ref={heroCtasRef} className="flex flex-wrap items-center justify-center gap-4 pt-1 will-change-transform">
              <button
                onClick={() => onNavigate('explore')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] transition-all rounded-sm shadow-[0_4px_20px_rgba(197,160,89,0.35)] cursor-pointer hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4" />
                <span>Explore All 6 Monuments</span>
              </button>
              <button
                onClick={() => onNavigate('3d-gallery')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#f7f3eb] bg-[#15231c]/90 hover:bg-[#1d3227] border border-[#c5a059]/40 transition-all rounded-sm cursor-pointer hover:border-[#c5a059]"
              >
                <Box className="w-4 h-4 text-[#c5a059]" />
                <span>Interactive 3D Studio</span>
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#f7f3eb] bg-[#15231c]/90 hover:bg-[#1d3227] border border-[#c5a059]/40 transition-all rounded-sm cursor-pointer hover:border-[#c5a059]"
              >
                <MapPin className="w-4 h-4 text-[#c5a059]" />
                <span>Heritage Map</span>
              </button>
            </div>

            {/* Hero Switcher Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {heroMonuments.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`h-1.5 transition-all cursor-pointer rounded-full ${
                    activeHeroIndex === idx ? 'w-8 bg-[#c5a059]' : 'w-2 bg-[#95a39a]/40 hover:bg-[#c5a059]/70'
                  }`}
                  aria-label={`View ${m.name}`}
                />
              ))}
            </div>

            {/* Scroll Indicator */}
            <div ref={heroIndicatorRef} className="pt-2 flex flex-col items-center gap-1.5 text-xs text-[#c5a059]/80 animate-bounce">
              <span className="text-[10px] tracking-widest uppercase">Scroll Down to Enter the Sanctuary</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Portal Callout Revealed at End of Hero Scroll */}
          <div
            ref={heroPortalRef}
            className="hero-scroll-portal absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center text-center opacity-0 px-6"
          >
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.3em] font-semibold text-[#c5a059]">
                Immersion Portal
              </div>
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb] tracking-wide">
                Descending into Ancient Stone
              </h2>
              <p className="text-base font-editorial italic text-[#cdd8d1]">
                Continue scrolling to witness structural geometry unfold
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          2. PINNED SCROLL-DRIVEN STORYTELLING CHAPTERS (TRANSFORMING PHOTOGRAPHS)
         ===================================================================== */}
      <section
        ref={storyPinRef}
        className="relative h-screen w-full bg-[#070e0a] overflow-hidden flex items-center border-b border-[#c5a059]/20"
      >
        {/* Subtle Ambient Background Watermark Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

        {/* Vertical Scroll Progress Bar (Left edge) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-30">
          <span className="text-[10px] font-mono-tabular text-[#c5a059]">01</span>
          <div className="w-[2px] h-40 bg-[#1a2d23] relative rounded-full overflow-hidden">
            <div
              ref={storyProgressRef}
              className="w-full h-full bg-[#c5a059] origin-top will-change-transform"
            />
          </div>
          <span className="text-[10px] font-mono-tabular text-[#9eb0a5]">03</span>
          <span className="text-[9px] uppercase tracking-widest text-[#c5a059] [writing-mode:vertical-rl] rotate-180 mt-2">
            Chapter 0{activeStoryChapter} / 03
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:pl-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Text Narrative Container (Crossfades synchronized with scroll) */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[440px] flex items-center">
            {/* Chapter 1: Rani ki Vav */}
            <div className="story-chapter absolute inset-0 flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
                <span>Chapter 01</span>
                <span aria-hidden="true">·</span>
                <span>Subterranean Hydro-Sanctuary</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb] leading-tight">
                Rani ki Vav: Sanctifying Ground Water
              </h2>
              <p className="text-sm sm:text-base font-editorial text-[#cdd8d1] leading-relaxed">
                Descending seven tiered pavilions 28 metres into the Patan aquifer, Queen Udayamati’s stepwell inverted Hindu temple geometry. Over 500 major sculptures honour Lord Vishnu reclining upon Ananta Sesha at the water's sacred threshold.
              </p>
              <div className="p-3 bg-[#111e17] border border-[#c5a059]/20 rounded-xs text-xs text-[#9eb0a5]">
                <strong className="text-[#f7f3eb]">Structural Feat:</strong> Designed as an inverted tiered temple so water pilgrims walked downward past tiers of sacred deities into the reservoir.
              </div>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('monument', 'rani-ki-vav')}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  <span>Examine Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-[#9eb0a5] font-mono-tabular">1063 CE · Solanki Dynasty</span>
              </div>
            </div>

            {/* Chapter 2: Konark Sun Temple */}
            <div className="story-chapter absolute inset-0 flex flex-col justify-center space-y-4 opacity-0 pointer-events-auto">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
                <span>Chapter 02</span>
                <span aria-hidden="true">·</span>
                <span>Archaeo-Astronomical Solar Dial</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb] leading-tight">
                Konark: 24 Sundial Chariot Wheels
              </h2>
              <p className="text-sm sm:text-base font-editorial text-[#cdd8d1] leading-relaxed">
                Conceived as Surya’s celestial chariot pulled by seven horses, Konark’s 24 wheels are not merely decorative reliefs. The shadows cast by the gnomon spokes calculate the exact time down to three-minute sub-intervals.
              </p>
              <div className="p-3 bg-[#111e17] border border-[#c5a059]/20 rounded-xs text-xs text-[#9eb0a5]">
                <strong className="text-[#f7f3eb]">Solar Geometry:</strong> The 8 major spokes represent the 8 prahars (3-hour periods) of the day, with beads marking minor subdivisions.
              </div>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('monument', 'konark-sun-temple')}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  <span>Examine Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-[#9eb0a5] font-mono-tabular">1250 CE · Eastern Ganga</span>
              </div>
            </div>

            {/* Chapter 3: Hampi Vittala Complex */}
            <div className="story-chapter absolute inset-0 flex flex-col justify-center space-y-4 opacity-0 pointer-events-auto">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
                <span>Chapter 03</span>
                <span aria-hidden="true">·</span>
                <span>Monolithic Granite & Litho-Acoustics</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb] leading-tight">
                Hampi: The Resonant Musical Pillars
              </h2>
              <p className="text-sm sm:text-base font-editorial text-[#cdd8d1] leading-relaxed">
                Carved from single boulders of Deccan granite, the Vittala Temple's 56 musical colonnettes emit bell-like tones when tapped. In the courtyard stands the iconic Stone Chariot with revolving ceremonial wheels.
              </p>
              <div className="p-3 bg-[#111e17] border border-[#c5a059]/20 rounded-xs text-xs text-[#9eb0a5]">
                <strong className="text-[#f7f3eb]">Lithic Acoustics:</strong> Cluster colonnettes carved from variable density granite blocks that produce distinct musical frequencies.
              </div>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('monument', 'hampi')}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  <span>Examine Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-[#9eb0a5] font-mono-tabular">1513 CE · Vijayanagara</span>
              </div>
            </div>
          </div>

          {/* Right Image Display (Scrubbed clip-path, rotation & scale transforms) */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[500px] w-full flex items-center justify-center">
            {/* Image 1: Rani ki Vav */}
            <div className="story-image-card absolute inset-0 rounded-sm overflow-hidden border border-[#c5a059]/30 shadow-2xl bg-[#121f18] will-change-transform">
              <img
                src={MONUMENTS[0].heroImage.url}
                alt="Rani ki Vav"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (MONUMENTS[0].heroImage.fallbackUrl && e.currentTarget.src !== MONUMENTS[0].heroImage.fallbackUrl) {
                    e.currentTarget.src = MONUMENTS[0].heroImage.fallbackUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09110d]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#c5a059]">
                <span>Patan, Gujarat · 23.8589° N</span>
                <span className="text-[#a5b6ab]">Bernard Gagnon (CC BY-SA 3.0)</span>
              </div>
            </div>

            {/* Image 2: Konark (With rotating sundial overlay) */}
            <div className="story-image-card absolute inset-0 rounded-sm overflow-hidden border border-[#c5a059]/30 shadow-2xl bg-[#121f18] opacity-0 will-change-transform">
              <img
                src={MONUMENTS[3].heroImage.url}
                alt="Konark Sun Temple"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (MONUMENTS[3].heroImage.fallbackUrl && e.currentTarget.src !== MONUMENTS[3].heroImage.fallbackUrl) {
                    e.currentTarget.src = MONUMENTS[3].heroImage.fallbackUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09110d]/90 via-transparent to-transparent" />

              {/* Rotating Archaeo-Astronomy Sundial Gnomon Overlay */}
              <div
                ref={storySunGnomonRef}
                className="absolute top-6 right-6 w-20 h-20 rounded-full border border-[#c5a059]/40 flex items-center justify-center pointer-events-none will-change-transform"
              >
                <div className="w-full h-[1px] bg-[#c5a059]/50" />
                <div className="h-full w-[1px] bg-[#c5a059]/50 absolute" />
                <div className="w-4 h-4 rounded-full border border-[#c5a059] absolute" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#c5a059]">
                <span>Konark, Odisha · 19.8876° N</span>
                <span className="text-[#a5b6ab]">Bernard Gagnon (CC BY-SA 3.0)</span>
              </div>
            </div>

            {/* Image 3: Hampi */}
            <div className="story-image-card absolute inset-0 rounded-sm overflow-hidden border border-[#c5a059]/30 shadow-2xl bg-[#121f18] opacity-0 will-change-transform">
              <img
                src={MONUMENTS[2].heroImage.url}
                alt="Hampi Stone Chariot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (MONUMENTS[2].heroImage.fallbackUrl && e.currentTarget.src !== MONUMENTS[2].heroImage.fallbackUrl) {
                    e.currentTarget.src = MONUMENTS[2].heroImage.fallbackUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09110d]/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#c5a059]">
                <span>Vijayanagara, Karnataka · 15.3350° N</span>
                <span className="text-[#a5b6ab]">Dey.sandip (CC BY-SA 3.0)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. HORIZONTAL SCROLL MONUMENT GALLERY (PINNED VERTICAL-TO-HORIZONTAL)
         ===================================================================== */}
      <section
        ref={horizontalSectionRef}
        className="relative bg-[#060c09] border-b border-[#c5a059]/20 overflow-hidden"
      >
        {/* Header Strip with Horizontal Progress Line */}
        <div className="py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              <span>Horizontal Architectural Track</span>
              <span aria-hidden="true">·</span>
              <span>Scroll to Traverse the Subcontinent</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb]">
              The Pan-Indian Heritage Corridor
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#9eb0a5] font-mono-tabular">
            <span>Scroll Down to Pan Across</span>
            <div className="w-24 h-1.5 bg-[#15231c] rounded-full overflow-hidden">
              <div
                ref={horizontalProgressRef}
                className="w-full h-full bg-[#c5a059] origin-left will-change-transform"
              />
            </div>
            <span>6 Sites</span>
          </div>
        </div>

        {/* Horizontal Track Container */}
        <div
          ref={horizontalTrackRef}
          className="flex gap-8 px-6 pb-20 will-change-transform md:w-max overflow-x-auto md:overflow-visible no-scrollbar"
        >
          {MONUMENTS.map((monument, idx) => (
            <div
              key={monument.id}
              className="w-[320px] sm:w-[420px] md:w-[480px] shrink-0 bg-[#0c1611] border border-[#c5a059]/25 hover:border-[#c5a059]/70 rounded-sm overflow-hidden flex flex-col transition-all duration-300 group shadow-xl hover:-translate-y-1 hover-trigger"
            >
              {/* Image Frame with Inner Parallax Translation */}
              <div className="relative aspect-[16/11] overflow-hidden bg-[#15231c]">
                <img
                  src={monument.heroImage.url}
                  alt={monument.name}
                  className="card-inner-img w-[115%] h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    if (monument.heroImage.fallbackUrl && e.currentTarget.src !== monument.heroImage.fallbackUrl) {
                      e.currentTarget.src = monument.heroImage.fallbackUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1611] via-transparent to-transparent opacity-85" />

                {/* Index Monogram */}
                <div className="absolute top-4 left-4 text-3xl font-cinzel font-extrabold text-[#c5a059]/80 font-mono-tabular">
                  0{idx + 1}
                </div>

                <div className="absolute top-4 right-4 bg-[#09110d]/90 text-[#f7f3eb] text-[11px] px-2.5 py-1 rounded-xs border border-white/10 font-mono-tabular">
                  {monument.state}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-[#9eb0a5] flex items-center gap-2">
                    <span>{monument.century}</span>
                    <span aria-hidden="true">·</span>
                    <span>{monument.dynasty.split(' ')[0]}</span>
                  </div>

                  <h3 className="text-2xl font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                    {monument.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#c7d5cd] font-editorial leading-relaxed line-clamp-3">
                    {monument.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#c5a059]/15 flex items-center justify-between">
                  <div className="text-[11px] text-[#7e9085]">
                    Photo: {monument.heroImage.photographer}
                  </div>

                  <button
                    onClick={() => onNavigate('monument', monument.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
                  >
                    <span>Examine Monograph</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. EDITORIAL PARALLAX CHAPTER WITH ROTATING SACRED MANDALA
         ===================================================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-[#c5a059]/15 relative overflow-hidden">
        {/* Background Rotating Astrolabe Mandala SVG */}
        <div className="absolute -right-32 -top-20 opacity-10 pointer-events-none">
          <svg
            ref={mandalaBgRef}
            width="540"
            height="540"
            viewBox="0 0 200 200"
            className="will-change-transform"
          >
            <circle cx="100" cy="100" r="90" fill="none" stroke="#c5a059" strokeWidth="1" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#c5a059" strokeWidth="0.7" strokeDasharray="3,3" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#c5a059" strokeWidth="0.8" />
            <polygon points="100,10 120,70 190,70 135,110 155,175 100,135 45,175 65,110 10,70 80,70" fill="none" stroke="#c5a059" strokeWidth="0.6" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              Curatorial Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#f7f3eb] leading-tight">
              Where Sacred Geometry Meets Structural Preservation
            </h2>
            <p className="text-sm sm:text-base font-editorial text-[#cdd8d1] leading-relaxed">
              Classical Indian treatises such as the <em>Mayamata</em>, <em>Manasara</em>, and <em>Shilpa Shastras</em> established rigorous geometric canons (Vastu Purusha Mandala) linking the cardinal points, solar azimuths, and subterranean moisture flows to temple structures.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('research')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Discuss Treatises with AI Scholar</span>
              </button>
              <button
                onClick={() => onNavigate('archive')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f7f3eb] border border-[#c5a059]/40 hover:border-[#c5a059] px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
              >
                <FolderArchive className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Browse Archaeological Papers</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-2 parallax-layer" data-speed="0.15">
              <span className="text-xs text-[#c5a059] font-mono-tabular font-bold">01. Solanki Dynasty</span>
              <h3 className="text-base font-cinzel font-bold text-[#f7f3eb]">Maru-Gurjara Subterranean Wonders</h3>
              <p className="text-xs text-[#a5b6ab] leading-relaxed">
                Stepwells like Rani ki Vav and stepped sun sanctuaries like Modhera balanced arid surface temperatures with descending water pavilions.
              </p>
            </div>

            <div className="p-6 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-2 parallax-layer" data-speed="0.25">
              <span className="text-xs text-[#c5a059] font-mono-tabular font-bold">02. Kalinga Dynasty</span>
              <h3 className="text-base font-cinzel font-bold text-[#f7f3eb]">Deula Astronomical Geometry</h3>
              <p className="text-xs text-[#a5b6ab] leading-relaxed">
                Konark’s rekha and pidha deula order captured the equinox morning sun while chlorite reliefs depicted classical Odissi dance postures.
              </p>
            </div>

            <div className="p-6 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-2 parallax-layer" data-speed="0.35">
              <span className="text-xs text-[#c5a059] font-mono-tabular font-bold">03. Vijayanagara Dynasty</span>
              <h3 className="text-base font-cinzel font-bold text-[#f7f3eb]">Monolithic Lithic Acoustics</h3>
              <p className="text-xs text-[#a5b6ab] leading-relaxed">
                Hampi’s Vittala complex integrated monolithic granite musical pillars and chariot shrines carved directly from river boulder formations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. SCROLL-REVEAL ARCHITECTURAL GRID (CLIP-PATH & SCALE REVEAL)
         ===================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-[#c5a059]/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              The Curated Masterworks
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#f7f3eb]">
              Six Monographic Inquiries
            </h2>
            <p className="text-sm font-editorial italic text-[#b8c7be]">
              Scroll down to watch each structural monograph reveal into view
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
          >
            <span>Explore All Monuments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MONUMENTS.map((monument) => (
            <div
              key={monument.id}
              className="scroll-reveal-box group bg-[#0e1712] border border-[#c5a059]/20 hover:border-[#c5a059] rounded-sm overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(197,160,89,0.15)] hover-trigger will-change-transform"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#16231c]">
                <img
                  src={monument.heroImage.url}
                  alt={monument.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    if (monument.heroImage.fallbackUrl && e.currentTarget.src !== monument.heroImage.fallbackUrl) {
                      e.currentTarget.src = monument.heroImage.fallbackUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1712] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-[#09110d]/90 text-[#c5a059] text-[11px] font-semibold px-2.5 py-1 rounded-xs border border-[#c5a059]/30">
                  {monument.state}
                </div>
                <div className="absolute top-3 right-3 bg-[#09110d]/90 text-[#f7f3eb] text-[11px] px-2.5 py-1 rounded-xs border border-white/10 font-mono-tabular">
                  {monument.unescoYear} UNESCO
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-[#9eb0a5] flex items-center gap-2">
                    <span>{monument.century}</span>
                    <span aria-hidden="true">·</span>
                    <span>{monument.dynasty}</span>
                  </div>
                  <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                    {monument.name}
                  </h3>
                  <p className="text-xs text-[#c7d5cd] line-clamp-2 leading-relaxed">
                    {monument.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#c5a059]/15 flex items-center justify-between">
                  <div className="text-[11px] text-[#7e9085]">
                    Photo: {monument.heroImage.photographer}
                  </div>
                  <button
                    onClick={() => onNavigate('monument', monument.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
                  >
                    <span>Examine</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. INTERACTIVE RESEARCH MODULES CALLOUT STRIP
         ===================================================================== */}
      <section className="py-20 bg-[#070e0a] border-b border-[#c5a059]/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              Interactive Laboratories
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#f7f3eb]">
              Experience Indian Heritage in Four Dimensions
            </h2>
            <p className="text-sm font-editorial text-[#b8c7be]">
              Interactive geospatial tracking, WebGL 3D architectural studies, primary field records, and AI scholarship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => onNavigate('map')}
              className="p-6 bg-[#0d1611] border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-sm space-y-3 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                Heritage Map
              </h3>
              <p className="text-xs text-[#9eb0a5] leading-relaxed">
                Google Maps Platform integration with geocoded markers and route directions to all six monument sites.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059]">
                <span>Launch Map</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('3d-gallery')}
              className="p-6 bg-[#0d1611] border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-sm space-y-3 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                3D Gallery
              </h3>
              <p className="text-xs text-[#9eb0a5] leading-relaxed">
                Interactive Three.js 3D models with orbital rotation, lighting presets, and exploded view layer inspection.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059]">
                <span>Launch 3D Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('archive')}
              className="p-6 bg-[#0d1611] border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-sm space-y-3 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                Digital Archive
              </h3>
              <p className="text-xs text-[#9eb0a5] leading-relaxed">
                Primary field notes, ASI surveys, epigraphy records, and researcher document deposit with preview.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059]">
                <span>Access Archive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('research')}
              className="p-6 bg-[#0d1611] border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-sm space-y-3 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-sm bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                AI Scholar
              </h3>
              <p className="text-xs text-[#9eb0a5] leading-relaxed">
                Server-side Gemini 3.8 Flash research assistant grounded in Indian architectural history and conservation science.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059]">
                <span>Start Dialogue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. ETHICAL ARCHIVING POLICY CALLOUT
         ===================================================================== */}
      <section className="py-14 px-6 max-w-5xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111e17] border border-[#c5a059]/25 text-xs text-[#c5a059]">
          <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
          <span>Curatorial Integrity Standard</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f7f3eb]">
          Authentic Human Photography & Responsible Digital Curation
        </h3>
        <p className="text-xs sm:text-sm text-[#9eb0a5] max-w-2xl mx-auto leading-relaxed">
          Every photograph on Sanskriti is sourced from human documentarians via Wikimedia Commons under Creative Commons licensing. We never generate artificial monument photographs.
        </p>
      </section>
    </div>
  );
};
