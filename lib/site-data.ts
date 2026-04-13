export type Musician = {
  slug: string;
  name: string;
  initials: string;
  primaryRole: string;
  instruments: string[];
  city: string;
  yearsExperience: number;
  churchExperience: string;
  genres: string[];
  availability: string;
  churchTypes: string[];
  shortBio: string;
  bio: string;
  churches: string[];
  events: string[];
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  media: string[];
  accentClass: string;
  distanceMiles: number;
  updatedAt: string;
  featured?: boolean;
};

export const musicians: Musician[] = [
  {
    slug: "moriah-bennett",
    name: "Moriah Bennett",
    initials: "MB",
    primaryRole: "Worship Vocalist & Acoustic Guitar",
    instruments: ["Vocals", "Acoustic Guitar"],
    city: "Champaign",
    yearsExperience: 11,
    churchExperience: "Led worship for weekly services, women's nights, and retreats.",
    genres: ["Contemporary Worship", "Gospel", "Acoustic"],
    availability: "Weekends and select Friday evenings",
    churchTypes: ["Non-denominational", "Baptist", "Campus Ministry"],
    shortBio: "Warm lead vocalist with experience building congregational confidence in mixed-age rooms.",
    bio: "Moriah serves as a worship vocalist and acoustic guitarist for weekend services, student worship gatherings, and ministry retreats. She is especially comfortable leading blended rooms where both modern worship and familiar hymns are part of the set.",
    churches: ["Hope Fellowship Savoy", "The Well Community Church", "Mercy Hill Young Adults"],
    events: ["Women's retreat sessions", "Prayer nights", "Outdoor worship gatherings"],
    phone: "(217) 555-0142",
    email: "moriah@example.com",
    whatsapp: "+12175550142",
    facebook: "https://facebook.com/moriahbennettmusic",
    instagram: "https://instagram.com/moriahbennettmusic",
    linkedin: "https://linkedin.com/in/moriahbennettmusic",
    media: ["Sunday worship set clip", "Acoustic hymn arrangement", "Choir rehearsal stills"],
    accentClass: "bg-[linear-gradient(135deg,#1f5f63,#2f8f88_52%,#f0c47b)]",
    distanceMiles: 4,
    updatedAt: "2026-04-09T18:00:00.000Z",
    featured: true
  },
  {
    slug: "isaiah-carter",
    name: "Isaiah Carter",
    initials: "IC",
    primaryRole: "Piano, Keys & Music Direction",
    instruments: ["Piano", "Keys", "Music Direction"],
    city: "Urbana",
    yearsExperience: 14,
    churchExperience: "Supports choir-led worship, altar ministry, and conference transitions.",
    genres: ["Gospel", "Traditional", "Contemporary Worship"],
    availability: "Sundays, rehearsals, and conference weekends",
    churchTypes: ["Church of God in Christ", "Pentecostal", "Community Church"],
    shortBio: "Versatile keys player comfortable with spontaneous ministry moments and arranged transitions.",
    bio: "Isaiah has served as a keyboardist and music director for churches, citywide worship nights, and youth conferences. He reads rooms well, supports spoken moments naturally, and communicates clearly with singers and rhythm sections.",
    churches: ["Greater Harvest Worship Center", "New Light Outreach Church", "Urbana Gospel Fellowship"],
    events: ["Youth revivals", "Church anniversaries", "Community prayer rallies"],
    phone: "(217) 555-0170",
    email: "isaiah@example.com",
    whatsapp: "+12175550170",
    facebook: "https://facebook.com/isaiahcarterkeys",
    instagram: "https://instagram.com/isaiahcarterkeys",
    linkedin: "https://linkedin.com/in/isaiahcarterkeys",
    media: ["Conference praise break clip", "Solo piano hymn medley", "Band rehearsal snapshot"],
    accentClass: "bg-[linear-gradient(135deg,#102327,#1f5f63_45%,#6ba292)]",
    distanceMiles: 2,
    updatedAt: "2026-04-12T14:00:00.000Z",
    featured: true
  },
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    initials: "EV",
    primaryRole: "Violin & Strings Arranger",
    instruments: ["Violin", "Strings Arranging"],
    city: "Savoy",
    yearsExperience: 9,
    churchExperience: "Adds texture for seasonal services, weddings, and reflective worship moments.",
    genres: ["Classical Crossover", "Worship", "Instrumental"],
    availability: "Seasonal events, weddings, and advance-booked services",
    churchTypes: ["Liturgical", "Community Church", "Multi-site"],
    shortBio: "Elegant violinist for worship services, weddings, and special church gatherings.",
    bio: "Elena brings expressive violin parts and small-string arrangements to worship teams that want warmth without clutter. She is often booked for Christmas, Easter, weddings, and devotional services.",
    churches: ["St. Matthew Parish", "Grace Harbor Church", "South Ridge Fellowship"],
    events: ["Wedding ceremonies", "Christmas Eve services", "Holy Week reflections"],
    phone: "(217) 555-0191",
    email: "elena@example.com",
    whatsapp: "+12175550191",
    facebook: "https://facebook.com/elenavasquezviolin",
    instagram: "https://instagram.com/elenavasquezviolin",
    linkedin: "https://linkedin.com/in/elenavasquezviolin",
    media: ["String quartet excerpt", "Violin-led worship intro", "Wedding processional sample"],
    accentClass: "bg-[linear-gradient(135deg,#8b5e3c,#d59b63_48%,#f5d8b4)]",
    distanceMiles: 7,
    updatedAt: "2026-04-07T10:00:00.000Z",
    featured: true
  },
  {
    slug: "caleb-nguyen",
    name: "Caleb Nguyen",
    initials: "CN",
    primaryRole: "Electric Guitar & Production Support",
    instruments: ["Electric Guitar", "Acoustic Guitar", "Playback Support"],
    city: "Mahomet",
    yearsExperience: 8,
    churchExperience: "Serves modern worship teams that need guitar textures and rehearsal support.",
    genres: ["Contemporary Worship", "Indie Worship", "Pop"],
    availability: "Weekends and midweek rehearsals",
    churchTypes: ["Non-denominational", "Evangelical", "Youth Ministry"],
    shortBio: "Modern worship guitarist with clean ambient textures and dependable rehearsal prep.",
    bio: "Caleb supports worship teams that run on arrangement detail, click tracks, and modern guitar tones. He is strong in rehearsal prep, patch organization, and helping volunteer teams feel comfortable.",
    churches: ["Northfield Church", "Revive Youth Collective", "Harvest Chapel Mahomet"],
    events: ["Student conferences", "Summer worship nights", "Multi-campus team nights"],
    phone: "(217) 555-0131",
    email: "caleb@example.com",
    whatsapp: "+12175550131",
    facebook: "https://facebook.com/calebnguyenguitar",
    instagram: "https://instagram.com/calebnguyenguitar",
    linkedin: "https://linkedin.com/in/calebnguyenguitar",
    media: ["Ambient intro loop clip", "Team rehearsal board", "Electric guitar patch list"],
    accentClass: "bg-[linear-gradient(135deg,#12363e,#325d6b_45%,#f28b66)]",
    distanceMiles: 14,
    updatedAt: "2026-04-10T08:30:00.000Z"
  },
  {
    slug: "ruth-daniels",
    name: "Ruth Daniels",
    initials: "RD",
    primaryRole: "Choir Director & Alto Section Leader",
    instruments: ["Vocals", "Choir Direction"],
    city: "Rantoul",
    yearsExperience: 18,
    churchExperience: "Experienced in choir rehearsals, blended services, and special Sundays.",
    genres: ["Gospel", "Hymns", "Choir Music"],
    availability: "Sunday mornings and seasonal choir intensives",
    churchTypes: ["Baptist", "Methodist", "Traditional"],
    shortBio: "Seasoned choir leader with strong rehearsal instincts and warm pastoral presence.",
    bio: "Ruth directs volunteer choirs, sections, and seasonal ensembles. She is especially valuable for churches rebuilding a music ministry rhythm and wanting both structure and warmth.",
    churches: ["Union Baptist Church", "First Methodist Rantoul", "Community Gospel Celebration Choir"],
    events: ["Choir anniversaries", "Homecoming Sundays", "Community sings"],
    phone: "(217) 555-0126",
    email: "ruth@example.com",
    whatsapp: "+12175550126",
    facebook: "https://facebook.com/ruthdanielschoral",
    instagram: "https://instagram.com/ruthdanielschoral",
    linkedin: "https://linkedin.com/in/ruthdanielschoral",
    media: ["Choir clinic handout", "Section rehearsal photo", "Anniversary service sample"],
    accentClass: "bg-[linear-gradient(135deg,#6f5d45,#967a53_45%,#cfb089)]",
    distanceMiles: 19,
    updatedAt: "2026-04-06T13:00:00.000Z"
  },
  {
    slug: "jonah-williams",
    name: "Jonah Williams",
    initials: "JW",
    primaryRole: "Drums & Rhythm Section Support",
    instruments: ["Drums", "Percussion"],
    city: "Champaign",
    yearsExperience: 10,
    churchExperience: "Works well with contemporary teams, gospel sets, and youth ministry environments.",
    genres: ["Contemporary Worship", "Gospel", "R&B"],
    availability: "Flexible weekends and advance-booked events",
    churchTypes: ["Pentecostal", "Non-denominational", "Youth Ministry"],
    shortBio: "Steady drummer who balances energy with sensitivity to worship flow.",
    bio: "Jonah is a dependable drummer for churches that need strong time, tasteful fills, and quick musical communication. He supports both click-based worship sets and more spontaneous church environments.",
    churches: ["Kingdom Life Church", "Restore Worship House", "CU Night of Worship"],
    events: ["Youth nights", "Sunday coverage", "Holiday outreaches"],
    phone: "(217) 555-0118",
    email: "jonah@example.com",
    whatsapp: "+12175550118",
    facebook: "https://facebook.com/jonahwilliamsdrums",
    instagram: "https://instagram.com/jonahwilliamsdrums",
    linkedin: "https://linkedin.com/in/jonahwilliamsdrums",
    media: ["Live drums mix sample", "Rehearsal setup photo", "Percussion loop clip"],
    accentClass: "bg-[linear-gradient(135deg,#3e4a5d,#506982_45%,#8eb8d8)]",
    distanceMiles: 5,
    updatedAt: "2026-04-13T09:00:00.000Z"
  }
];

export const testimonials = [
  {
    name: "Pastor Alana Brooks",
    role: "Worship Pastor, Champaign",
    quote:
      "We needed a substitute keys player for a Sunday with very little lead time. A ministry-focused profile made the decision simple."
  },
  {
    name: "Marcus Hill",
    role: "Event Coordinator, Urbana",
    quote:
      "The combination of church history, style tags, and direct links is exactly what planners need when comparing musicians."
  },
  {
    name: "Elder Naomi Price",
    role: "Music Ministry Leader, Rantoul",
    quote:
      "This feels designed for churches instead of forcing us into a generic entertainment marketplace."
  }
];

export const instrumentPhotos = [
  {
    title: "Piano and keys",
    caption: "For churches that need a steady accompanist, worship keys player, or music director.",
    alt: "Close view of piano keys under warm stage lighting.",
    src: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Acoustic guitar",
    caption: "Useful for stripped-down worship sets, retreats, prayer nights, and campus ministry gatherings.",
    alt: "Acoustic guitar resting near a microphone stand in a worship setting.",
    src: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Drums and rhythm",
    caption: "For churches looking for tasteful timing, dynamic support, and confident transitions.",
    alt: "Drum kit on a stage with warm lights and cymbals visible.",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Violin and strings",
    caption: "Ideal for weddings, Christmas services, Holy Week gatherings, and reflective worship moments.",
    alt: "Violin and bow placed on sheet music with soft natural light.",
    src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80"
  }
];

export const faqItems = [
  {
    question: "Who is this directory for?",
    answer:
      "It is designed for churches, pastors, worship leaders, ministry coordinators, conference hosts, and local musicians who want a ministry-friendly public profile."
  },
  {
    question: "Can musicians list both church and event experience?",
    answer:
      "Yes. Profiles include church service history, conferences, weddings, retreats, and other ministry-related events."
  },
  {
    question: "How are accessibility requirements handled?",
    answer:
      "The interface uses semantic landmarks, labeled controls, visible focus states, keyboard support, and clear contrast to align with WCAG 2.1 Level AA practices."
  },
  {
    question: "Can churches request musicians instead of browsing manually?",
    answer:
      "Yes. The request page lets churches describe the event, budget, worship style, and needed instruments so musicians can be matched later."
  }
];

export const moderationQueue = [
  {
    name: "Danielle Ross",
    role: "Soprano / Worship Leader",
    submittedAt: "2026-04-11",
    status: "Pending review",
    issue: "Needs one ministry reference checked"
  },
  {
    name: "Thomas Reed",
    role: "Bass Guitar",
    submittedAt: "2026-04-10",
    status: "Needs edit",
    issue: "Broken Instagram URL"
  },
  {
    name: "Avery Cole",
    role: "Keys / Organ",
    submittedAt: "2026-04-09",
    status: "Ready to approve",
    issue: "All required fields present"
  }
];

export function getFeaturedMusicians() {
  return musicians.filter((musician) => musician.featured);
}

export function getMusicianBySlug(slug: string) {
  return musicians.find((musician) => musician.slug === slug);
}
