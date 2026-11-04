export interface PhotoMetadata {
  url: string;
  fallbackUrl?: string;
  sourceUrl: string;
  photographer: string;
  license: string;
  licenseUrl?: string;
  caption: string;
}

export interface ArchitecturalDetail {
  feature: string;
  description: string;
}

export interface Monument {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East';
  coordinates: {
    lat: number;
    lng: number;
  };
  century: string;
  dynasty: string;
  patron: string;
  architecturalStyle: string;
  material: string;
  unescoYear: number;
  summary: string;
  significance: string;
  heroImage: PhotoMetadata;
  galleryImages: PhotoMetadata[];
  architecturalAnalysis: {
    overview: string;
    highlights: ArchitecturalDetail[];
    astronomicalOrEngineeringMarvel: string;
  };
  historicalTimeline: Array<{
    period: string;
    event: string;
  }>;
  visitorInformation: {
    visitingHours: string;
    bestSeason: string;
    nearestAirport: string;
    nearestRailway: string;
  };
}

export const MONUMENTS: Monument[] = [
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav',
    hindiName: 'रानी की वाव',
    location: 'Patan, Gujarat',
    state: 'Gujarat',
    region: 'West',
    coordinates: {
      lat: 23.8589,
      lng: 72.1014,
    },
    century: '11th Century CE (c. 1063 CE)',
    dynasty: 'Chaulukya (Solanki) Dynasty',
    patron: 'Queen Udayamati in memory of King Bhima I',
    architecturalStyle: 'Maru-Gurjara Subterranean Temple Architecture',
    material: 'Dhrangadhra fine sandstone',
    unescoYear: 2014,
    summary: 'An inverted underground stepped temple-well designed as an inverted sanctum honouring sacred water, descending seven storeys into the earth with over 500 major sculptures.',
    significance: 'Recognised as a masterpiece of subterranean stepwell engineering and Solanki artistic virtuosity. Unlike traditional elevated Hindu shrines, it sanctifies the underground aquifer as a sacred tirtha (water pilgrimage).',
    heroImage: {
      url: '/images/monuments/rani-ki-vav.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Rani_ki_vav_07.jpg/1280px-Rani_ki_vav_07.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rani_ki_vav_07.jpg',
      photographer: 'Bernard Gagnon',
      license: 'CC BY-SA 3.0 / CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      caption: 'The subterranean carved pavilions and descending terraces of Rani ki Vav at Patan.',
    },
    galleryImages: [
      {
        url: '/images/monuments/rani-ki-vav.jpg',
        fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Rani_ki_vav_07.jpg/1280px-Rani_ki_vav_07.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rani_ki_vav_07.jpg',
        photographer: 'Bernard Gagnon',
        license: 'CC BY-SA 3.0',
        caption: 'Seven-tiered pavilion galleries with sculptured pillared corridors.',
      },
    ],
    architecturalAnalysis: {
      overview: 'Rani ki Vav measures 65 metres in length, 20 metres in width, and 28 metres in depth. Designed on an east-west axis, visitors descend through stepped terraces past pillared multi-storey pavilions to reach the circular well shaft.',
      highlights: [
        {
          feature: 'Inverted Temple Sanctuary',
          description: 'Conceived as an inverted temple descending toward the sanctum of water, paying tribute to Varuna and the sanctity of the groundwater table.'
        },
        {
          feature: 'Dashavatara Iconographic Program',
          description: 'Features high-relief panels of the ten incarnations of Lord Vishnu (Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Balarama/Krishna, Buddha, and Kalki), with Sheshashayi Vishnu resting on Ananta Sesha at the water level.'
        },
        {
          feature: 'Apsara & Nagakanya Reliefs',
          description: 'Delicately sculpted celestial nymphs engaged in Solah Shringar (sixteen classical adornments) alongside protective serpent maidens guarding the water chambers.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'Silted over by the Saraswati River for centuries, the alluvial mud preserved the crisp Solanki stonework from arid weathering until excavation by the Archaeological Survey of India between 1958 and 1986.'
    },
    historicalTimeline: [
      { period: '1063 CE', event: 'Commissioned by Queen Udayamati of the Chaulukya dynasty following the passing of her consort, Bhimdev I.' },
      { period: '1304 CE', event: 'Chronicled by Jain monk Merutunga in the Prabandha-Chintamani text.' },
      { period: '1980s', event: 'Major excavation and desiltation completed by the Archaeological Survey of India (ASI).' },
      { period: '2014', event: 'Inscribed as a UNESCO World Heritage Site.' }
    ],
    visitorInformation: {
      visitingHours: '08:00 AM – 06:00 PM IST',
      bestSeason: 'October to March (Mild winter weather)',
      nearestAirport: 'Sardar Vallabhbhai Patel International Airport, Ahmedabad (125 km)',
      nearestRailway: 'Mehsana Junction (55 km) or Patan Railway Station'
    }
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    hindiName: 'ताजमहल',
    location: 'Agra, Uttar Pradesh',
    state: 'Uttar Pradesh',
    region: 'North',
    coordinates: {
      lat: 27.1751,
      lng: 78.0421,
    },
    century: '17th Century CE (1631–1648 CE)',
    dynasty: 'Mughal Empire',
    patron: 'Emperor Shah Jahan for Empress Mumtaz Mahal',
    architecturalStyle: 'High Mughal Classical Architecture',
    material: 'Translucent Makrana white marble, red sandstone plinths, and pietra dura inlay of 28 semi-precious stone varieties',
    unescoYear: 1983,
    summary: 'The pinnacle of Mughal architectural genius, a monumental white marble mausoleum set amidst symmetrical Charbagh paradise gardens beside the Yamuna River.',
    significance: 'Regarded as universally sublime, demonstrating bilateral symmetry, optical illusions where the minarets slant slightly outward for earthquake safety and visual correction, and intricate pietra dura lapidary craftsmanship.',
    heroImage: {
      url: '/images/monuments/taj-mahal.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg',
      photographer: 'Yann Forget / edited by Muhammad Mahdi Karim',
      license: 'CC BY-SA 4.0 / CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      caption: 'The symmetrical marble facade and reflective pool of the Taj Mahal at Agra.',
    },
    galleryImages: [
      {
        url: '/images/monuments/taj-mahal.jpg',
        fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg',
        photographer: 'Yann Forget / Muhammad Mahdi Karim',
        license: 'CC BY-SA 4.0',
        caption: 'Central onion dome rising above the iwan archways.',
      },
    ],
    architecturalAnalysis: {
      overview: 'Conceived on a quadripartite grid representing the Gardens of Paradise (Rawza-i-Munawwara), the Taj Mahal rests on a raised marble plinth flanked by four 40-metre minarets and two red sandstone outbuildings: the Mosque and the Jawab.',
      highlights: [
        {
          feature: 'Parchin Kari (Pietra Dura)',
          description: 'Botanical arabesques and floral sprays inlaid with lapis lazuli, carnelian, jade, jasper, turquoise, and mother-of-pearl cut to fraction-of-a-millimetre precision.'
        },
        {
          feature: 'Optical Minaret Inclination',
          description: 'The four corner minarets are angled slightly outwards (3 degrees) so that in case of seismic collapse they fall away from the mausoleum, while simultaneously correcting the human optical illusion of tipping inward.'
        },
        {
          feature: 'Thuluth Calligraphy Progression',
          description: 'Inscribed Quranic verses designed by calligrapher Abd ul-Haq (Amanat Khan) grow gradually larger with height so they appear uniform in size to an observer standing at ground level.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'The entire monument rests upon deep wooden caissons and well foundations submerged in the water table of the Yamuna River; continuous moisture is essential to keep the ebony timber structural base sturdy.'
    },
    historicalTimeline: [
      { period: '1631 CE', event: 'Death of Empress Mumtaz Mahal; Emperor Shah Jahan commissions the memorial complex.' },
      { period: '1648 CE', event: 'Primary mausoleum completed by an artisan guild led by Ustad Ahmad Lahori.' },
      { period: '1653 CE', event: 'Surrounding gardens, gateways, and outbuildings fully concluded.' },
      { period: '1983', event: 'Designated a UNESCO World Heritage Site.' }
    ],
    visitorInformation: {
      visitingHours: 'Sunrise to Sunset (Closed on Fridays)',
      bestSeason: 'October to March',
      nearestAirport: 'Agra Domestic Airport / Indira Gandhi International Airport, New Delhi (200 km)',
      nearestRailway: 'Agra Cantt Railway Station (6 km)'
    }
  },
  {
    id: 'hampi',
    name: 'Hampi (Vijaya Vittala & Stone Chariot)',
    hindiName: 'हम्पी (विजयनगर)',
    location: 'Vijayanagara District, Karnataka',
    state: 'Karnataka',
    region: 'South',
    coordinates: {
      lat: 15.3350,
      lng: 76.4600,
    },
    century: '14th–16th Century CE',
    dynasty: 'Vijayanagara Empire (Sangama & Tuluva dynasties)',
    patron: 'King Devaraya II & King Krishnadevaraya',
    architecturalStyle: 'Monumental Dravidian Granite Architecture',
    material: 'Locally quarried granite boulders, schist carvings, and brick-and-lime superstructures',
    unescoYear: 1986,
    summary: 'The legendary capital of the Vijayanagara Empire set among dramatic boulder-strewn hills along the Tungabhadra River, renowned for the iconic Stone Chariot and musical pillars of Vittala Temple.',
    significance: 'One of the wealthiest mediaeval metropolises in the world during the 16th century, spanning over 4,100 hectares with monumental temples, royal enclosures, aqueducts, and bustling bazaar colonnades.',
    heroImage: {
      url: '/images/monuments/hampi.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Stone_Chariot_Hampi.jpg/1280px-Stone_Chariot_Hampi.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stone_Chariot_Hampi.jpg',
      photographer: 'Dey.sandip',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      caption: 'The monolithic Stone Chariot (Garuda Shrine) in the courtyard of Vijaya Vittala Temple, Hampi.',
    },
    galleryImages: [
      {
        url: '/images/monuments/hampi.jpg',
        fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Stone_Chariot_Hampi.jpg/1280px-Stone_Chariot_Hampi.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stone_Chariot_Hampi.jpg',
        photographer: 'Dey.sandip',
        license: 'CC BY-SA 3.0',
        caption: 'Stone Chariot sculpted with revolving wheels and battle-elephant guardians.',
      },
    ],
    architecturalAnalysis: {
      overview: 'Vijaya Vittala Temple represents the peak of Vijayanagara artistic expression. Built inside a walled rectangular compound, it includes the Maha Mandapa (Great Pillared Hall), the Kalyana Mandapa (Marriage Hall), and the iconic Stone Chariot shrine.',
      highlights: [
        {
          feature: 'The Stone Chariot (Garuda Vahana)',
          description: 'A shrine dedicated to Garuda (the eagle mount of Vishnu) built in the shape of a procession chariot, complete with concentric spoke wheels and floral hub motifs.'
        },
        {
          feature: 'SaReGaMa Musical Pillars',
          description: '56 monolithic cluster pillars in the Ranga Mandapa. Each central pillar is surrounded by 7 slender colonnettes carved from single granite blocks that emit distinct musical notes when struck.'
        },
        {
          feature: 'Yali & Mythical Balustrades',
          description: 'Hyper-dynamic stone brackets depicting rearing Yalis (chimeric beast with lion body and elephant trunk) ridden by armed warriors.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'The acoustic design of the granite pillars relies on varying mineral densities and hollowed resonant cores within solid granite, demonstrating advanced litho-acoustic engineering.'
    },
    historicalTimeline: [
      { period: '1336 CE', event: 'Founding of the Vijayanagara Empire by Harihara I and Bukka Raya I.' },
      { period: '1513 CE', event: 'King Krishnadevaraya commemorates his victory over Gajapatis by commissioning the Stone Chariot at Vittala Temple.' },
      { period: '1565 CE', event: 'Battle of Talikota leads to the sacking of the city.' },
      { period: '1986', event: 'Inscribed as a UNESCO World Heritage Site.' }
    ],
    visitorInformation: {
      visitingHours: '06:00 AM – 06:00 PM IST',
      bestSeason: 'November to February (Pleasant winter climate)',
      nearestAirport: 'Jindal Vijaynagar Airport, Bellary (VDY, 40 km) / Hubballi Airport (140 km)',
      nearestRailway: 'Hosapete Junction (HPT, 13 km)'
    }
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर',
    location: 'Konark, Puri District, Odisha',
    state: 'Odisha',
    region: 'East',
    coordinates: {
      lat: 19.8876,
      lng: 86.0945,
    },
    century: '13th Century CE (c. 1250 CE)',
    dynasty: 'Eastern Ganga Dynasty',
    patron: 'King Narasimhadeva I',
    architecturalStyle: 'Kalinga Architecture (Deula order)',
    material: 'Khondalite stone, chlorite relief carvings, and iron dowel structural clamps',
    unescoYear: 1984,
    summary: 'A colossal 13th-century stone temple conceived as the 24-wheeled chariot of Surya, the Sun God, pulled by seven spirited horses towards the dawn across the Bay of Bengal.',
    significance: 'Renowned for its 24 monumental wheels that function as precise astronomical sundials, its expressive chlorite sculptures, and its complex iron-girder engineering.',
    heroImage: {
      url: '/images/monuments/konark-sun-temple.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Konark_Sun_Temple_01.jpg/1280px-Konark_Sun_Temple_01.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple_01.jpg',
      photographer: 'Bernard Gagnon',
      license: 'CC BY-SA 3.0 / CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      caption: 'The monumental Jagamohana (assembly hall) and stone chariot wheels at Konark.',
    },
    galleryImages: [
      {
        url: '/images/monuments/konark-sun-temple.jpg',
        fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Konark_Sun_Temple_01.jpg/1280px-Konark_Sun_Temple_01.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple_01.jpg',
        photographer: 'Bernard Gagnon',
        license: 'CC BY-SA 3.0',
        caption: 'The terraced pyramidal roof of the Jagamohana adorned with musicians and dancers.',
      },
    ],
    architecturalAnalysis: {
      overview: 'The temple was originally composed of a towering 70-metre Rekha Deula sanctum (now ruined) and the surviving 39-metre Jagamohana (Porch / Hall of Audience), set on an expansive plinth with 24 carved wheels.',
      highlights: [
        {
          feature: 'The 24 Astronomical Chariot Wheels',
          description: 'Each 3-metre diameter wheel has 8 major spokes and 8 minor spokes. The shadow cast by the wheel axle onto the spokes allows time measurement down to minute intervals.'
        },
        {
          feature: 'Natamandira (Dance Pavilion)',
          description: 'An open-hypostyle hall fronting the temple, carved with 128 postures of Odissi classical dance as documented in the Natya Shastra.'
        },
        {
          feature: 'Seven Chariot Horses',
          description: 'Representing the seven days of the week, the seven colours of visible light (VIBGYOR), and the seven Vedic metres of verse.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'The main sanctum once contained a 52-ton magnetic iron lodestone crowning the tower that held the Surya deity suspended in mid-air via magnetic levitation, until colonial removal.'
    },
    historicalTimeline: [
      { period: '1250 CE', event: 'Commissioned by King Narasimhadeva I with master architect Bisu Maharana leading 1,200 artisans over 12 years.' },
      { period: '1568 CE', event: 'Kalapahad raids damage the tower structure.' },
      { period: '1901 CE', event: 'Lieutenant Governor Sir John Woodburn orders the Jagamohana filled with sand to prevent collapse.' },
      { period: '1984', event: 'Designated a UNESCO World Heritage Site.' }
    ],
    visitorInformation: {
      visitingHours: '06:00 AM – 08:00 PM IST',
      bestSeason: 'September to March (Konark Dance Festival held in December)',
      nearestAirport: 'Biju Patnaik International Airport, Bhubaneswar (65 km)',
      nearestRailway: 'Puri Railway Station (35 km) or Bhubaneswar Junction (65 km)'
    }
  },
  {
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    hindiName: 'अजंता गुफाएं',
    location: 'Chhatrapati Sambhajinagar (Aurangabad), Maharashtra',
    state: 'Maharashtra',
    region: 'West',
    coordinates: {
      lat: 20.5519,
      lng: 75.7033,
    },
    century: '2nd Century BCE to 5th Century CE',
    dynasty: 'Satavahana Dynasty (Phase 1) & Vakataka Dynasty (Phase 2, under Harishena)',
    patron: 'Royal ministers, Buddhist sanghas, and Vakataka nobility',
    architecturalStyle: 'Ancient Buddhist Rock-Cut Chaitya-Grihas & Viharas',
    material: 'Deccan Traps flood basalt rock cliffs',
    unescoYear: 1983,
    summary: 'A horseshoe cliff of 30 rock-cut Buddhist cave monuments housing the undisputed masterpieces of ancient Indian mural painting and monumental rock sculpture.',
    significance: 'Preserves the finest surviving ancient tempera frescoes in Asia, depicting Jataka tales, celestial beings (Gandharvas, Kinnaras), and the celebrated Bodhisattva Padmapani and Vajrapani murals.',
    heroImage: {
      url: '/images/monuments/ajanta-caves.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Ajanta_caves_panorama_2010.jpg/1280px-Ajanta_caves_panorama_2010.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ajanta_caves_panorama_2010.jpg',
      photographer: 'Marcin Białek',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      caption: 'The dramatic horseshoe gorge of the Waghur River embracing the 30 rock-cut caves of Ajanta.',
    },
    galleryImages: [
      {
        url: '/images/monuments/ajanta-caves.jpg',
        fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Ajanta_caves_panorama_2010.jpg/1280px-Ajanta_caves_panorama_2010.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ajanta_caves_panorama_2010.jpg',
        photographer: 'Marcin Białek',
        license: 'CC BY-SA 4.0',
        caption: 'The basalt cliff face carved with ornate chaitya facades and monastery entrances.',
      },
    ],
    architecturalAnalysis: {
      overview: 'The caves are carved in two distinct historical waves: the early Hinayana (Theravada) phase (Caves 9, 10, 12, 13, 15A) and the later Mahayana phase under Vakataka Emperor Harishena (5th century CE).',
      highlights: [
        {
          feature: 'Cave 1 & Bodhisattva Padmapani',
          description: 'The iconic fresco of Bodhisattva holding a blue lotus, rendered with tribhanga pose, expressive almond eyes, and shading that creates sculptural volume on flat rock.'
        },
        {
          feature: 'Cave 26 Chaitya & Mahaparinirvana',
          description: 'A grand cathedral-like prayer hall housing a 7-metre reclining Buddha entering Nirvana, surrounded by weeping monks below and celestial deities above.'
        },
        {
          feature: 'Mineral Pigment Chemistry',
          description: 'Wall preparations used fermented clay, organic cow-dung binder, and rice husks covered with fine lime plaster, painted with lapis lazuli (imported from Badakhshan), red ochre, lamp black, and malachite.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'Caves 19 and 26 are aligned so that during the summer and winter solstices, the morning sun penetrates directly through the chaitya sun-window to illuminate the stupa within the dark interior.'
    },
    historicalTimeline: [
      { period: '2nd Century BCE', event: 'First phase of excavation under Satavahana patronage creates early monastic viharas and chaityas.' },
      { period: 'c. 460–477 CE', event: 'Renaissance under Emperor Harishena of the Vakataka Empire produces the painted masterpieces.' },
      { period: '1819 CE', event: 'Rediscovered accidentally by British officer Captain John Smith while hunting tigers.' },
      { period: '1983', event: 'Inscribed as a UNESCO World Heritage Site.' }
    ],
    visitorInformation: {
      visitingHours: '09:00 AM – 05:00 PM IST (Closed on Mondays)',
      bestSeason: 'June to March (Lush green waterfalls during monsoons, comfortable winter)',
      nearestAirport: 'Chhatrapati Sambhajinagar Airport (IXU, 100 km)',
      nearestRailway: 'Jalgaon Junction (60 km) or Aurangabad Railway Station (105 km)'
    }
  },
  {
    id: 'modhera-sun-temple',
    name: 'Modhera Sun Temple',
    hindiName: 'मोढेरा सूर्य मंदिर',
    location: 'Modhera, Mehsana District, Gujarat',
    state: 'Gujarat',
    region: 'West',
    coordinates: {
      lat: 23.5835,
      lng: 72.1330,
    },
    century: '11th Century CE (1026–1027 CE)',
    dynasty: 'Chaulukya (Solanki) Dynasty',
    patron: 'King Bhima I',
    architecturalStyle: 'Maru-Gurjara Temple Architecture',
    material: 'Golden yellow sandstone',
    unescoYear: 2022, // Tentative list
    summary: 'An exquisitely proportioned solar temple complex on the banks of the Pushpavati River, designed so that the first rays of the rising sun on the equinox shone directly into the golden sanctum.',
    significance: 'Celebrated for its grand stepped water reservoir (Surya Kund) containing 108 miniature shrines, and the Sabha Mandap supported by 52 intricately carved pillars representing the weeks of the year.',
    heroImage: {
      url: '/images/monuments/modhera-sun-temple.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Sun_Temple%2C_Modhera_08.jpg/1280px-Sun_Temple%2C_Modhera_08.jpg',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sun_Temple,_Modhera_08.jpg',
      photographer: 'Bernard Gagnon',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      caption: 'The stepped reservoir (Surya Kund) and temple complex of Modhera Sun Temple.',
    },
    galleryImages: [
      {
        url: '/images/monuments/modhera-sun-temple.jpg',
      fallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Sun_Temple%2C_Modhera_08.jpg/1280px-Sun_Temple%2C_Modhera_08.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sun_Temple,_Modhera_08.jpg',
        photographer: 'Bernard Gagnon',
        license: 'CC BY-SA 3.0',
        caption: 'Geometric stepped terraces leading down to the sacred waters of Surya Kund.',
      },
    ],
    architecturalAnalysis: {
      overview: 'The complex consists of three axially aligned segments: Surya Kund (the stepped tank), the Sabha Mandap (Hall of Gathering), and the Guda Mandap (Sanctum Sanctorum).',
      highlights: [
        {
          feature: 'Surya Kund (Rama Kund)',
          description: 'A 100-metre rectangular stepped reservoir with geometric cascading stairways punctuated by 108 miniature shrines dedicated to Ganesha, Shiva, and solar deities.'
        },
        {
          feature: 'The 52-Pillared Sabha Mandap',
          description: 'An open-air octagonal hall resting on 52 intricately carved pillars depicting scenes from the Ramayana, Mahabharata, and the 12 Adityas (solar aspects).'
        },
        {
          feature: 'Torana Archways',
          description: 'Cusp-shaped ornamental cusped torana archways springing from floral corbels framing the eastern approach.'
        }
      ],
      astronomicalOrEngineeringMarvel: 'Positioned precisely on the Tropic of Cancer (23.58° N), during the vernal and autumnal equinoxes, the sun rays illuminated the diamond on the crown of the Surya idol in the inner sanctum.'
    },
    historicalTimeline: [
      { period: '1026 CE', event: 'Commissioned by King Bhimdev I of the Solanki dynasty following the defense against Mahmud of Ghazni.' },
      { period: 'c. 1300 CE', event: 'Damage sustained to superstructure during regional invasions.' },
      { period: '2022', event: 'Modhera declared India’s first 24/7 solar-powered heritage village and added to the UNESCO Tentative List.' }
    ],
    visitorInformation: {
      visitingHours: '07:00 AM – 06:00 PM IST (Evening 3D projection mapping on weekends)',
      bestSeason: 'October to March (Modhera Dance Festival held every January)',
      nearestAirport: 'Sardar Vallabhbhai Patel International Airport, Ahmedabad (95 km)',
      nearestRailway: 'Mehsana Junction (25 km)'
    }
  }
];

export function getMonumentById(id: string): Monument | undefined {
  return MONUMENTS.find((m) => m.id === id);
}
