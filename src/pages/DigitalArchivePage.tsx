import React, { useState, useEffect } from 'react';
import { INITIAL_ARCHIVE_RECORDS, ArchiveRecord } from '../data/archiveData';
import { MONUMENTS } from '../data/monuments';
import { PageId } from '../components/Header';
import {
  FolderArchive,
  Upload,
  FileText,
  Image as ImageIcon,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Tag,
  Calendar,
  User,
  ExternalLink,
  Plus
} from 'lucide-react';

interface DigitalArchivePageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const DigitalArchivePage: React.FC<DigitalArchivePageProps> = ({ onNavigate }) => {
  const [records, setRecords] = useState<ArchiveRecord[]>(() => {
    const saved = sessionStorage.getItem('sanskriti_archive_records_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ARCHIVE_RECORDS;
      }
    }
    return INITIAL_ARCHIVE_RECORDS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectRecord, setInspectRecord] = useState<ArchiveRecord | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadMonumentId, setUploadMonumentId] = useState('rani-ki-vav');
  const [uploadCategory, setUploadCategory] = useState<ArchiveRecord['category']>('Architectural Plans');
  const [uploadContributor, setUploadContributor] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Save to sessionStorage whenever records change
  useEffect(() => {
    try {
      sessionStorage.setItem('sanskriti_archive_records_v2', JSON.stringify(records));
    } catch (e) {
      console.warn('Session storage quota exceeded or unavailable');
    }
  }, [records]);

  const categories = [
    'All',
    'Architectural Plans',
    'Epigraphy & Inscriptions',
    'Conservation Reports',
    'Historical Field Notes',
    'Astronomical Surveys',
  ];

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contributor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || r.category === selectedCategory;

    const matchesMonument =
      selectedMonumentId === 'All' || r.monumentId === selectedMonumentId;

    return matchesSearch && matchesCategory && matchesMonument;
  });

  // Handle local file selection and preview generation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadError('');

    // If image, create data URL preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadPreview('');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a document or image file to upload.');
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError('Please provide an archival record title.');
      return;
    }

    const monument = MONUMENTS.find((m) => m.id === uploadMonumentId);
    const isImage = uploadFile.type.startsWith('image/');

    const newRecord: ArchiveRecord = {
      id: `user-${Date.now()}`,
      title: uploadTitle.trim(),
      monumentId: uploadMonumentId,
      monumentName: monument ? monument.name : 'General Heritage',
      category: uploadCategory,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      contributor: uploadContributor.trim() || 'Guest Researcher (Active Session)',
      source: 'Direct Digital Field Deposit',
      description: uploadDescription.trim() || 'Uploaded research field observation or documentary plate.',
      fileType: isImage ? 'image' : 'pdf',
      fileSize: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
      previewUrl: uploadPreview || (monument ? monument.heroImage.url : ''),
      tags: uploadTags
        ? uploadTags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Field Deposit', monument?.state || 'India'],
      isUserUploaded: true,
    };

    setRecords([newRecord, ...records]);
    setUploadSuccess(true);

    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadPreview('');
      setUploadTitle('');
      setUploadContributor('');
      setUploadDescription('');
      setUploadTags('');
      setUploadSuccess(false);
      setUploadError('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Storage Clarity Banner */}
        <div className="space-y-4 border-b border-[#c5a059]/15 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
                <span>Living Document Repository</span>
                <span aria-hidden="true">·</span>
                <span>Scholarly Field Archive</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb] mt-1">
                Digital Heritage Archive
              </h1>
              <p className="text-sm font-editorial text-[#b8c7be] max-w-2xl mt-1">
                Browse primary historical field surveys, epigraphical transcriptions, and conservation reports, or contribute new field documentation.
              </p>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] rounded-sm transition-colors cursor-pointer shrink-0 shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Deposit Document / Field Photo</span>
            </button>
          </div>

          {/* Prototype Storage Status Banner */}
          <div className="p-3.5 bg-[#121f18] border border-[#c5a059]/25 rounded-sm flex items-start gap-3 text-xs text-[#a3b6ab]">
            <AlertCircle className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#f7f3eb]">Storage Scope Transparency:</strong> Pre-seeded documents represent official archaeological survey archives. User-uploaded files are held securely in your browser's <span className="text-[#c5a059]">Interactive Session Storage</span> for immediate cross-page research and viewing. Permanent institutional ingestion requires authenticated ASI/curatorial sign-off.
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#9eb0a5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive titles, contributors, keywords (e.g. 'sundial', 'lapis', 'Burgess')..."
                className="w-full bg-[#09110d] border border-[#c5a059]/25 focus:border-[#c5a059] text-xs text-[#f7f3eb] placeholder-[#77887e] pl-10 pr-4 py-2.5 rounded-sm outline-none"
              />
            </div>

            {/* Monument Filter Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-[#9eb0a5] shrink-0">Monument:</span>
              <select
                value={selectedMonumentId}
                onChange={(e) => setSelectedMonumentId(e.target.value)}
                className="bg-[#09110d] border border-[#c5a059]/25 text-xs text-[#f7f3eb] px-3 py-2 rounded-xs outline-none cursor-pointer w-full md:w-auto"
              >
                <option value="All">All Monuments</option>
                {MONUMENTS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#c5a059]/15">
            <span className="text-xs text-[#9eb0a5] mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c5a059] text-[#09110d]'
                    : 'bg-[#09110d] text-[#c7d5cd] hover:bg-[#16251e] border border-[#c5a059]/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Archive Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-[#0e1712] border border-[#c5a059]/20 hover:border-[#c5a059]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-all group p-5 space-y-4"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#c5a059] font-semibold">{record.category}</span>
                  {record.isUserUploaded ? (
                    <span className="text-[10px] bg-[#c5a059]/20 text-[#c5a059] px-2 py-0.5 rounded-xs border border-[#c5a059]/30">
                      Session Deposit
                    </span>
                  ) : (
                    <span className="text-[#889a8f] font-mono-tabular">{record.date}</span>
                  )}
                </div>

                {/* Monument association */}
                <div className="text-xs text-[#9eb0a5] font-cinzel">
                  {record.monumentName}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors leading-snug">
                  {record.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#c7d5cd] leading-relaxed line-clamp-3">
                  {record.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {record.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-[#8ea095] bg-[#09110d] px-2 py-0.5 rounded-xs border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom metadata and action */}
              <div className="pt-3 border-t border-[#c5a059]/15 flex items-center justify-between text-xs">
                <div className="text-[#889a8f] text-[11px] truncate max-w-[180px]">
                  By: {record.contributor}
                </div>
                <button
                  onClick={() => setInspectRecord(record)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Record</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Document Inspector */}
        {inspectRecord && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#101b15] border border-[#c5a059]/40 max-w-2xl w-full rounded-sm p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-[#c5a059]/20 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
                    {inspectRecord.category} · {inspectRecord.monumentName}
                  </span>
                  <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] mt-1">
                    {inspectRecord.title}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectRecord(null)}
                  className="p-1.5 text-[#9eb0a5] hover:text-[#f7f3eb] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Image Preview */}
              {inspectRecord.previewUrl && (
                <div className="relative aspect-[16/9] bg-[#09110d] rounded-xs overflow-hidden border border-[#c5a059]/20">
                  <img
                    src={inspectRecord.previewUrl}
                    alt={inspectRecord.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to local monument photo if available
                      const monument = MONUMENTS.find(m => m.id === inspectRecord.monumentId);
                      if (monument && monument.heroImage.url && e.currentTarget.src !== monument.heroImage.url) {
                        e.currentTarget.src = monument.heroImage.url;
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-[#09110d]/90 text-[10px] text-[#9eb0a5] px-2 py-0.5 rounded-xs">
                    File: {inspectRecord.fileSize} · {inspectRecord.fileType.toUpperCase()}
                  </div>
                </div>
              )}

              {/* Dossier Details */}
              <div className="space-y-3 text-xs text-[#c7d5cd] leading-relaxed">
                <div>
                  <strong className="text-[#f7f3eb] block mb-1">Archival Description:</strong>
                  <p>{inspectRecord.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#c5a059]/15">
                  <div>
                    <span className="text-[#889a8f] block">Lead Contributor:</span>
                    <span className="font-semibold text-[#f7f3eb]">{inspectRecord.contributor}</span>
                  </div>
                  <div>
                    <span className="text-[#889a8f] block">Origin Publication / Source:</span>
                    <span className="text-[#f7f3eb]">{inspectRecord.source}</span>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-4 border-t border-[#c5a059]/20 flex items-center justify-between">
                <button
                  onClick={() => {
                    const mId = inspectRecord.monumentId;
                    setInspectRecord(null);
                    onNavigate('monument', mId);
                  }}
                  className="text-xs text-[#c5a059] hover:underline cursor-pointer"
                >
                  Go to {inspectRecord.monumentName} Monograph
                </button>
                <button
                  onClick={() => setInspectRecord(null)}
                  className="px-4 py-2 bg-[#16251e] hover:bg-[#1f352a] text-xs font-semibold uppercase tracking-wider text-[#f7f3eb] rounded-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Upload & Tag Archival Document */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#101b15] border border-[#c5a059]/40 max-w-lg w-full rounded-sm p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-3">
                <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb]">
                  Deposit Field Document or Photograph
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-[#9eb0a5] hover:text-[#f7f3eb] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#c5a059] mx-auto animate-bounce" />
                  <h4 className="text-lg font-cinzel font-bold text-[#f7f3eb]">Deposit Confirmed</h4>
                  <p className="text-xs text-[#9eb0a5]">Your record has been indexed into the active session archive.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                  {uploadError && (
                    <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 rounded-xs">
                      {uploadError}
                    </div>
                  )}

                  {/* File input */}
                  <div>
                    <label className="block text-[#c5cfc8] mb-1 font-semibold">
                      Select Image or Document File (PNG, JPG, PDF, TXT) *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt"
                      onChange={handleFileChange}
                      className="w-full bg-[#09110d] border border-[#c5a059]/30 text-xs text-[#f7f3eb] p-2 rounded-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-xs file:border-0 file:text-xs file:bg-[#c5a059] file:text-[#09110d] file:font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Preview if image or document badge */}
                  {uploadPreview ? (
                    <div className="relative aspect-video rounded-xs overflow-hidden border border-[#c5a059]/30">
                      <img src={uploadPreview} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                  ) : uploadFile ? (
                    <div className="p-3 bg-[#09110d] rounded-xs border border-[#c5a059]/30 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#c5a059] shrink-0" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-[#f7f3eb] truncate">{uploadFile.name}</div>
                        <div className="text-[11px] text-[#9eb0a5]">{(uploadFile.size / 1024).toFixed(1)} KB · File ready for archival deposit</div>
                      </div>
                    </div>
                  ) : null}

                  {/* Title */}
                  <div>
                    <label className="block text-[#c5cfc8] mb-1 font-semibold">
                      Archival Title *
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Field Survey of Hampi Kalyana Mandapa Pillar Alignments"
                      className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2.5 rounded-xs text-[#f7f3eb] outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  {/* Monument & Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#c5cfc8] mb-1 font-semibold">
                        Associated Monument
                      </label>
                      <select
                        value={uploadMonumentId}
                        onChange={(e) => setUploadMonumentId(e.target.value)}
                        className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2 rounded-xs text-[#f7f3eb] outline-none"
                      >
                        {MONUMENTS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#c5cfc8] mb-1 font-semibold">
                        Category
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2 rounded-xs text-[#f7f3eb] outline-none"
                      >
                        <option value="Architectural Plans">Architectural Plans</option>
                        <option value="Epigraphy & Inscriptions">Epigraphy & Inscriptions</option>
                        <option value="Conservation Reports">Conservation Reports</option>
                        <option value="Historical Field Notes">Historical Field Notes</option>
                        <option value="Astronomical Surveys">Astronomical Surveys</option>
                      </select>
                    </div>
                  </div>

                  {/* Contributor */}
                  <div>
                    <label className="block text-[#c5cfc8] mb-1 font-semibold">
                      Contributor / Field Researcher Name
                    </label>
                    <input
                      type="text"
                      value={uploadContributor}
                      onChange={(e) => setUploadContributor(e.target.value)}
                      placeholder="e.g. Dr. Ananya Sharma (Dept of Archaeology)"
                      className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2 rounded-xs text-[#f7f3eb] outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[#c5cfc8] mb-1 font-semibold">
                      Description & Archival Findings
                    </label>
                    <textarea
                      rows={3}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Detail the discovery, physical measurements, architectural context..."
                      className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2 rounded-xs text-[#f7f3eb] outline-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[#c5cfc8] mb-1 font-semibold">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={uploadTags}
                      onChange={(e) => setUploadTags(e.target.value)}
                      placeholder="e.g. Field Note, Granite, Acoustical Study"
                      className="w-full bg-[#09110d] border border-[#c5a059]/30 p-2 rounded-xs text-[#f7f3eb] outline-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 bg-[#16251e] hover:bg-[#1f352a] text-[#c5cfc8] rounded-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] font-semibold uppercase tracking-wider rounded-xs cursor-pointer"
                    >
                      Deposit Document
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
