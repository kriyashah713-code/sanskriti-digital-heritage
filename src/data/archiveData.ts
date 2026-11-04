export interface ArchiveRecord {
  id: string;
  title: string;
  monumentId: string;
  monumentName: string;
  category: 'Architectural Plans' | 'Epigraphy & Inscriptions' | 'Conservation Reports' | 'Historical Field Notes' | 'Astronomical Surveys';
  date: string;
  contributor: string;
  source: string;
  description: string;
  fileType: 'image' | 'pdf' | 'document';
  fileSize: string;
  previewUrl: string;
  tags: string[];
  isUserUploaded?: boolean;
}

export const INITIAL_ARCHIVE_RECORDS: ArchiveRecord[] = [
  {
    id: 'arch-001',
    title: 'Archaeological Survey of Western India: Stepwell Structural Transverse Sections',
    monumentId: 'rani-ki-vav',
    monumentName: 'Rani ki Vav',
    category: 'Architectural Plans',
    date: '1886 / Re-archived 1986',
    contributor: 'James Burgess (ASI Western Circle)',
    source: 'Imperial Archaeological Survey Bulletin Vol. IX',
    description: 'Detailed hand-measured elevation schematics and subterranean pavilion cross-sections detailing the multi-storey stepped descent and well shaft geometry.',
    fileType: 'document',
    fileSize: '4.8 MB',
    previewUrl: '/images/monuments/rani-ki-vav.jpg',
    tags: ['Subterranean Hydro-Engineering', 'Solanki Dynasty', 'Patan', 'Measured Drawing'],
  },
  {
    id: 'arch-002',
    title: 'Astronomical Alignment and Gnomon Shadow Analysis of Konark 24 Chariot Wheels',
    monumentId: 'konark-sun-temple',
    monumentName: 'Konark Sun Temple',
    category: 'Astronomical Surveys',
    date: '1974',
    contributor: 'Dr. K. S. Behera (Centre of Advanced Study in History)',
    source: 'Odisha Heritage Architectural Archives',
    description: 'Calculations on solar dial accuracy, detailing how each of the 8 major spokes corresponds to a 3-hour prahar and the bead markers measure 3-minute sub-intervals.',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    previewUrl: '/images/monuments/konark-sun-temple.jpg',
    tags: ['Archaeo-Astronomy', 'Surya Chariot', 'Sundial Mechanics', 'Kalinga'],
  },
  {
    id: 'arch-003',
    title: 'Epigraphical Carnatica: Vittala Temple Kannada Inscriptions (Saka 1435)',
    monumentId: 'hampi',
    monumentName: 'Hampi',
    category: 'Epigraphy & Inscriptions',
    date: '1513 CE / Catalogued 1904',
    contributor: 'B. Lewis Rice & H. Krishna Sastri',
    source: 'Epigraphia Indica Vol. VII',
    description: 'Transcription of the royal edict issued by Emperor Krishnadevaraya following the conquest of Udayagiri, endowing golden vessels to the Vittala shrine.',
    fileType: 'document',
    fileSize: '1.4 MB',
    previewUrl: '/images/monuments/hampi.jpg',
    tags: ['Vijayanagara Epigraphy', 'Krishnadevaraya', 'Stone Inscription', 'Garuda Shrine'],
  },
  {
    id: 'arch-004',
    title: 'Micro-Spectroscopic Analysis of Ajanta Cave 1 Murals: Organic Binders & Pigments',
    monumentId: 'ajanta-caves',
    monumentName: 'Ajanta Caves',
    category: 'Conservation Reports',
    date: '2019',
    contributor: 'National Research Laboratory for Conservation of Cultural Property (NRLC)',
    source: 'International Journal of Heritage Studies',
    description: 'Chemical identification of imported Afghan lapis lazuli, plant gums, and calcium carbonate plasters on the Bodhisattva Padmapani and Vajrapani panels.',
    fileType: 'pdf',
    fileSize: '6.2 MB',
    previewUrl: '/images/monuments/ajanta-caves.jpg',
    tags: ['Pigment Chromatography', 'Buddhist Tempera', 'Cave Conservation', 'Vakataka'],
  },
  {
    id: 'arch-005',
    title: 'Surya Kund Geometric Stepped Pavilions: Architectural Plan & Elevation',
    monumentId: 'modhera-sun-temple',
    monumentName: 'Modhera Sun Temple',
    category: 'Architectural Plans',
    date: '1937',
    contributor: 'Archaeological Survey of Baroda State',
    source: 'State Archaeology Department Monograph',
    description: 'Planometric survey of the 108 miniature shrines and pyramidal stepped stairways forming the rectangular water reservoir of Modhera.',
    fileType: 'image',
    fileSize: '3.7 MB',
    previewUrl: '/images/monuments/modhera-sun-temple.jpg',
    tags: ['Surya Kund', '108 Shrines', 'Maru-Gurjara', 'Stepped Tank'],
  },
  {
    id: 'arch-006',
    title: 'Structural Stability and Subterranean Well Caissons of the Yamuna Riverbed',
    monumentId: 'taj-mahal',
    monumentName: 'Taj Mahal',
    category: 'Conservation Reports',
    date: '2016',
    contributor: 'Central Building Research Institute (CBRI Roorkee)',
    source: 'National Heritage Technical Bulletin',
    description: 'Geotechnical analysis of the deep timber wells and moisture-stabilised sal wood foundations anchoring the 4-minaret plinth along the riverbank.',
    fileType: 'pdf',
    fileSize: '5.5 MB',
    previewUrl: '/images/monuments/taj-mahal.jpg',
    tags: ['Caisson Foundations', 'Riverbed Mechanics', 'Mughal Engineering', 'Agra'],
  }
];
