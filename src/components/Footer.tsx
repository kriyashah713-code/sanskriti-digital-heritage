import React from 'react';
import { PageId } from './Header';
import { Landmark, Compass, Box, MapPin, Sparkles, FolderArchive, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#060c09] text-[#95a39a] border-t border-[#c5a059]/15 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-[#c5a059]/10">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-cinzel font-bold text-[#f7f3eb] tracking-widest">
              SANSKRITI
            </h2>
            <p className="text-sm font-editorial italic text-[#c5cfc8] leading-relaxed text-base">
              "India’s living digital heritage archive preserving architectural marvels, sacred geometry, and millennium-old traditions through cutting-edge digital curation."
            </p>
            <div className="text-xs text-[#7d8c83] leading-relaxed">
              Curated in compliance with international heritage documentation guidelines and open scholarly access.
            </div>
          </div>

          {/* Core Monuments */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
              Featured Monuments
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('monument', 'rani-ki-vav')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Rani ki Vav, Patan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monument', 'taj-mahal')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Taj Mahal, Agra</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monument', 'hampi')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Vijaya Vittala & Chariot, Hampi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monument', 'konark-sun-temple')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Konark Sun Temple, Odisha</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monument', 'ajanta-caves')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Ajanta Caves, Maharashtra</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monument', 'modhera-sun-temple')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>Modhera Sun Temple, Gujarat</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Interactive Labs */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
              Interactive Modules
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#c5a059]" />
                  <span>Explore Heritage Catalog</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#c5a059]" />
                  <span>Interactive Heritage Map</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('3d-gallery')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Box className="w-4 h-4 text-[#c5a059]" />
                  <span>3D Architectural Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('archive')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4 text-[#c5a059]" />
                  <span>Digital Archive & Field Notes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('research')}
                  className="hover:text-[#f7f3eb] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>AI Research Scholar (Gemini)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Scholarly Attribution & Archival Ethics */}
          <div className="space-y-4 text-xs leading-relaxed">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
              Ethical Archiving Policy
            </h3>
            <p className="text-[#a5b4ab]">
              All monument photography is strictly sourced from verified human documentary captures under Creative Commons (CC BY-SA) and Wikimedia Commons archives.
            </p>
            <p className="text-[#a5b4ab]">
              No AI hallucination or fabricated monument imagery is permitted. 3D models are labelled as interpretive structural studies.
            </p>
            <div className="pt-1">
              <a
                href="https://commons.wikimedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#c5a059] hover:underline"
              >
                <span>Wikimedia Commons Repository</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#728378]">
          <p>© {new Date().getFullYear()} SANSKRITI Heritage Archive. Built for cultural preservation and scholarly exploration.</p>
          <div className="flex items-center gap-6">
            <span>Open Access Scholarly Initiative</span>
            <span>·</span>
            <span>Archaeological Standards Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
