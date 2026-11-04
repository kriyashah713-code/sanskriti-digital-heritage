import React from 'react';
import { getMonumentById, MONUMENTS, Monument } from '../data/monuments';
import { PageId } from '../components/Header';
import { INITIAL_ARCHIVE_RECORDS } from '../data/archiveData';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Box,
  Compass,
  ExternalLink,
  ShieldCheck,
  Clock,
  Plane,
  Train,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface MonumentDetailPageProps {
  monumentId: string;
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const MonumentDetailPage: React.FC<MonumentDetailPageProps> = ({
  monumentId,
  onNavigate,
}) => {
  const monument = getMonumentById(monumentId) || MONUMENTS[0];

  // Related archive documents
  const relatedArchives = INITIAL_ARCHIVE_RECORDS.filter(
    (a) => a.monumentId === monument.id
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${monument.coordinates.lat},${monument.coordinates.lng}`;

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] pb-24">
      {/* Back to Explore Bar */}
      <div className="bg-[#0b1610] border-b border-[#c5a059]/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9eb0a5] hover:text-[#f7f3eb] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </button>

          {/* Quick Monument Switcher */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#9eb0a5]">
            <span>Quick switch:</span>
            {MONUMENTS.map((m) => (
              <button
                key={m.id}
                onClick={() => onNavigate('monument', m.id)}
                className={`transition-colors cursor-pointer ${
                  m.id === monument.id
                    ? 'text-[#c5a059] font-bold underline'
                    : 'hover:text-[#f7f3eb]'
                }`}
              >
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Monograph Banner */}
      <div className="relative h-[65vh] min-h-[460px] max-h-[680px] overflow-hidden border-b border-[#c5a059]/20">
        <img
          src={monument.heroImage.url}
          alt={monument.name}
          className="w-full h-full object-cover brightness-85 contrast-105 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (monument.heroImage.fallbackUrl && e.currentTarget.src !== monument.heroImage.fallbackUrl) {
              e.currentTarget.src = monument.heroImage.fallbackUrl;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09110d] via-[#09110d]/40 to-black/30" />

        {/* Hero Overlay Information */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#c5a059] font-semibold tracking-wider uppercase">
            <span>{monument.state}, India</span>
            <span aria-hidden="true">·</span>
            <span>{monument.century}</span>
            <span aria-hidden="true">·</span>
            <span>{monument.dynasty}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-mono-tabular">UNESCO {monument.unescoYear}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold text-[#f7f3eb]">
                {monument.name}
              </h1>
              <p className="text-xl sm:text-2xl font-editorial italic text-[#d4c3ab] mt-1">
                {monument.hindiName}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#15231c]/90 hover:bg-[#1f352a] text-[#f7f3eb] border border-[#c5a059]/40 rounded-sm transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-[#9eb0a5]" />
              </a>

              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#15231c]/90 hover:bg-[#1f352a] text-[#f7f3eb] border border-[#c5a059]/40 rounded-sm transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>View on Map</span>
              </button>

              <button
                onClick={() => onNavigate('research')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] rounded-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Scholar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Photograph Provenance Box */}
      <div className="max-w-7xl mx-auto px-6 -mt-4 relative z-10">
        <div className="bg-[#101b15] border border-[#c5a059]/30 p-3.5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#a3b3a9] shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>
              <strong className="text-[#f7f3eb]">Documentary Photo Provenance:</strong> {monument.heroImage.caption}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] shrink-0 font-mono-tabular">
            <span>Photographer: <strong className="text-[#f7f3eb]">{monument.heroImage.photographer}</strong></span>
            <span>License: <strong className="text-[#c5a059]">{monument.heroImage.license}</strong></span>
            <a
              href={monument.heroImage.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c5a059] hover:underline flex items-center gap-1"
            >
              <span>Source File</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Monograph Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Architectural & Historical Narrative */}
        <div className="lg:col-span-8 space-y-12">
          {/* Executive Architectural Summary */}
          <section className="space-y-4">
            <h2 className="text-2xl font-cinzel font-bold text-[#f7f3eb] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c5a059]" />
              <span>Architectural Significance</span>
            </h2>
            <p className="text-base sm:text-lg font-editorial text-[#cdd8d1] leading-relaxed">
              {monument.significance}
            </p>
            <div className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm">
              <p className="text-sm text-[#b8c7be] leading-relaxed">
                {monument.architecturalAnalysis.overview}
              </p>
            </div>
          </section>

          {/* Key Architectural & Astronomical Highlights */}
          <section className="space-y-6">
            <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb]">
              Core Structural Highlights
            </h3>
            <div className="space-y-4">
              {monument.architecturalAnalysis.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#0e1712] border border-[#c5a059]/15 rounded-sm space-y-2 hover:border-[#c5a059]/40 transition-colors"
                >
                  <h4 className="text-base font-semibold text-[#c5a059] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                    <span>{h.feature}</span>
                  </h4>
                  <p className="text-sm text-[#c7d5cd] leading-relaxed pl-6">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Astronomical / Engineering Marvel Callout */}
            <div className="p-5 bg-[#15241c] border-l-2 border-[#c5a059] rounded-sm space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#c5a059]">
                Lithic Engineering & Archaeo-Astronomy
              </span>
              <p className="text-sm font-editorial text-[#e4ece7] leading-relaxed">
                {monument.architecturalAnalysis.astronomicalOrEngineeringMarvel}
              </p>
            </div>
          </section>

          {/* Historical Timeline */}
          <section className="space-y-6">
            <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#c5a059]" />
              <span>Chronological History & Excavation</span>
            </h3>
            <div className="space-y-4 pl-4 border-l border-[#c5a059]/25">
              {monument.historicalTimeline.map((item, index) => (
                <div key={index} className="relative pl-6 space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#c5a059] border-2 border-[#09110d]" />
                  <span className="text-xs font-mono-tabular font-bold text-[#c5a059]">
                    {item.period}
                  </span>
                  <p className="text-sm text-[#c7d5cd] leading-relaxed">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Archival Field Records */}
          {relatedArchives.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-[#c5a059]/15">
              <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] flex items-center justify-between">
                <span>Associated Archival Records</span>
                <button
                  onClick={() => onNavigate('archive')}
                  className="text-xs text-[#c5a059] hover:underline cursor-pointer"
                >
                  View Archive Collection
                </button>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArchives.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-2 hover:border-[#c5a059]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9eb0a5]">
                      <span className="font-semibold text-[#c5a059]">{record.category}</span>
                      <span>{record.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#f7f3eb] line-clamp-1">
                      {record.title}
                    </h4>
                    <p className="text-xs text-[#a8b8ae] line-clamp-2">
                      {record.description}
                    </p>
                    <div className="text-[11px] text-[#7d8f84] pt-1">
                      Contributor: {record.contributor}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Specifications & Visitor Logistics */}
        <div className="lg:col-span-4 space-y-8">
          {/* Architectural Factsheet */}
          <div className="p-6 bg-[#101b15] border border-[#c5a059]/25 rounded-sm space-y-5">
            <h3 className="text-sm font-cinzel font-bold text-[#c5a059] tracking-wider uppercase border-b border-[#c5a059]/20 pb-3">
              Monument Factsheet
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[#889a8f] block">Dynasty / Reign:</span>
                <span className="font-semibold text-[#f7f3eb] text-sm">{monument.dynasty}</span>
              </div>
              <div>
                <span className="text-[#889a8f] block">Royal Patron:</span>
                <span className="text-[#f7f3eb]">{monument.patron}</span>
              </div>
              <div>
                <span className="text-[#889a8f] block">Architectural Style:</span>
                <span className="text-[#f7f3eb]">{monument.architecturalStyle}</span>
              </div>
              <div>
                <span className="text-[#889a8f] block">Primary Lithic Material:</span>
                <span className="text-[#f7f3eb]">{monument.material}</span>
              </div>
              <div>
                <span className="text-[#889a8f] block">Geographic Coordinates:</span>
                <span className="text-[#f7f3eb] font-mono-tabular">
                  {monument.coordinates.lat.toFixed(4)}° N, {monument.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-[#889a8f] block">UNESCO Inscription:</span>
                <span className="text-[#c5a059] font-bold font-mono-tabular">Year {monument.unescoYear}</span>
              </div>
            </div>
          </div>

          {/* Visitor Logistics */}
          <div className="p-6 bg-[#101b15] border border-[#c5a059]/25 rounded-sm space-y-4">
            <h3 className="text-sm font-cinzel font-bold text-[#c5a059] tracking-wider uppercase border-b border-[#c5a059]/20 pb-3">
              Visitor Access & Logistics
            </h3>
            <div className="space-y-3 text-xs text-[#c7d5cd]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#f7f3eb] block">Visiting Hours:</span>
                  <span>{monument.visitorInformation.visitingHours}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#f7f3eb] block">Best Season:</span>
                  <span>{monument.visitorInformation.bestSeason}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#f7f3eb] block">Nearest Airport:</span>
                  <span>{monument.visitorInformation.nearestAirport}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#f7f3eb] block">Nearest Railway:</span>
                  <span>{monument.visitorInformation.nearestRailway}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Model Teaser */}
          <div className="p-6 bg-gradient-to-br from-[#122319] to-[#0c1811] border border-[#c5a059]/30 rounded-sm space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
              <Box className="w-6 h-6" />
            </div>
            <h4 className="text-base font-cinzel font-bold text-[#f7f3eb]">
              Interactive 3D Study
            </h4>
            <p className="text-xs text-[#a7b8ad]">
              Inspect structural 3D models with orbital rotation, lighting adjustments, and wireframe views in our Three.js gallery.
            </p>
            <button
              onClick={() => onNavigate('3d-gallery')}
              className="w-full py-2.5 px-4 bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] font-semibold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              Launch 3D Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
