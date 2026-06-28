export type Category = "Ads" | "Copy" | "Campaigns";

export type VideoEmbed = {
  type: "youtube" | "shorts" | "spotify";
  id: string;
  label?: string;
  fbUrl?: string;
  fbViews?: string;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  role: string;
  categories: Category[];
  summary: string;
  coverImage: string;
  visible: boolean;
  content: {
    tagline?: string;
    sections: { heading: string; body: string }[];
    adCopy?: { lines: string[] };
    stats?: { label: string; value: string }[];
    videos?: VideoEmbed[];
    images?: string[];
    spotifyTrackId?: string;
    extraLinks?: { label: string; url: string }[];
    scriptQuote?: string;
    copyLines?: { featured: string[]; all: string[] };
    workshopCopy?: string;
    metaResults?: { label: string; value: string }[];
    strategyPillars?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "oyo",
    title: "Brand Campaign — Unlocking a New Demand Segment for OYO",
    client: "OYO",
    role: "First Copywriter at OYO",
    categories: ["Copy", "Ads"],
    summary:
      "Wrote the campaign that normalised couple-friendly hotel stays across India — 250K+ bookings/month.",
    coverImage: "/assets/oyo/slide-7.png",
    visible: true,
    content: {
      tagline: '"Get a room"',
      sections: [
        {
          heading: "Problem",
          body: "Demand existed. But it had no safe, visible outlet. Unmarried couples across India couldn't reliably find hotel rooms — hotels denied local ID check-ins, social stigma was high, and the experience was awkward at best. This wasn't just a product problem. It was a perception problem.",
        },
        {
          heading: "Insight",
          body: "For many young Indians, privacy was hard to find. Most lived with parents. Hotels felt risky. Public spaces — parks, parking lots, a friend's flat — became the default.",
        },
        {
          heading: "Strategy",
          body: "Make the category acceptable.\n1. Remove Ambiguity → 2. Signal Safety → 3. Normalise Behaviour",
        },
        {
          heading: "Writing Approach",
          body: '"The response had to feel like it came from a friend, not a brand. Not a warning. Not a lecture. More like a wink."\n\nCampaign line: "Get a room"',
        },
        {
          heading: "The Product",
          body: 'Introduced "Couple Friendly OYOs" — a toggle on the app letting users filter only hotels that accept local ID check-ins for unmarried couples.',
        },
        {
          heading: "Execution",
          body: "Digital Ads, Push Notifications, Social Media, In-App Messaging, SMS, Blogs & Email",
        },
      ],
      adCopy: {
        lines: [
          "No more friend's flat, No more elevators and cabs. Use Relationship Mode to Find Couple Friendly OYO Near You. Local ID is Not A Problem.",
          "No more corner seats, No more parks and parkings. Introducing Couple Friendly OYOs",
          "With In-Room Dining Because you're way past romantic dinners. Introducing Couple Friendly OYOs",
          "At An Affordable Price So you can book again next week. Introducing Couple Friendly OYOs",
        ],
      },
      stats: [
        { label: "Bookings/month", value: "250K+" },
        { label: "Impact", value: "Campaign went viral" },
        { label: "Created", value: "Nationwide demand for couple-friendly stays" },
      ],
      images: [
        "/assets/oyo/slide-7.png",
        "/assets/oyo/slide-8.png",
        "/assets/oyo/slide-9.png",
        "/assets/oyo/slide-10.png",
      ],
    },
  },
  {
    slug: "nepal-election",
    title: "Scaling a Political Campaign to 16M Views in 60 Days",
    client: "Birender Kanodia | Nepal",
    role: "Campaign Director, led 12-member team",
    categories: ["Campaigns"],
    summary:
      "Led a 12-person team to take a political page from 25K to 15.9M views in 60 days using a 3-pillar content system.",
    coverImage: "/assets/nepal/slide-1.png",
    visible: true,
    content: {
      sections: [
        {
          heading: "Starting Point",
          body: "25K followers, near-zero engagement. 60-day election window. Facebook-first audience. Low reach, no distribution system.",
        },
        {
          heading: "Strategy — 3-Pillar Content System",
          body: "1. Candidate Narrative (Authority) — turned rallies into high-energy videos, extracted 30s interview reels, built responses to opposition\n2. Audience Voice (Trust) — captured local opinions, amplified trusted media\n3. Policy Visualisation (Clarity) — turned policies into visual stories, printed QR codes for manifesto download",
        },
        {
          heading: "Distribution",
          body: "Reels-first for reach → Live sessions for engagement → Multi-account amplification for scale",
        },
        {
          heading: "Execution",
          body: "Led 12-person team in a daily content→distribution→feedback loop. Daily planning, rally capture, long-to-short conversion, multi-platform publishing, opposition monitoring.",
        },
      ],
      stats: [
        { label: "Total Views", value: "15,959,069" },
        { label: "Growth", value: "+989,302.9%" },
        { label: "Engagement", value: "571,939" },
        { label: "Viewers", value: "1,774,346" },
        { label: "Messaging Conversations", value: "4,559" },
        { label: "Peak Day Views", value: "1,901,171" },
      ],
      videos: [
        {
          type: "youtube",
          id: "1qzrExsy2bQ",
          label: "Main Campaign Film",
          fbUrl: "https://www.facebook.com/share/v/18bGeJdZ4J/",
          fbViews: "137K",
        },
        {
          type: "youtube",
          id: "VzGQHQM2ocM",
          label: "Candidate Narrative",
          fbUrl: "https://www.facebook.com/share/r/1AxaVsq8pr/",
          fbViews: "284K",
        },
        {
          type: "youtube",
          id: "0w0SG8_AnSI",
          label: "On-ground Interviews",
          fbUrl: "https://www.facebook.com/share/r/1BtzzBTsf5/",
          fbViews: "273K",
        },
        {
          type: "youtube",
          id: "Y5tzf4OkJCs",
          label: "Policy Film 1 — Vision",
          fbUrl: "https://www.facebook.com/share/v/1CgqwGvQok/",
          fbViews: "115K",
        },
        {
          type: "youtube",
          id: "Aqh6OtD69Kw",
          label: "Policy Film 2 — Sports",
          fbUrl: "https://www.facebook.com/share/v/1HapgpkAit/",
          fbViews: "269K",
        },
        {
          type: "youtube",
          id: "JvyuMH9oZkE",
          label: "Policy Film 3 — Farms",
          fbUrl: "https://www.facebook.com/share/v/1CiuYfop8j/",
          fbViews: "691K",
        },
      ],
      images: [
        "/assets/nepal/slide-11.png",
        "/assets/nepal/slide-12.png",
        "/assets/nepal/slide-13.png",
      ],
    },
  },
  {
    slug: "lepton",
    title: "Turning a Complex Geospatial SaaS into Clear Sales Messaging",
    client: "Lepton Software",
    role: "Product Marketing | Messaging & Sales Enablement",
    categories: ["Copy", "Campaigns"],
    summary:
      'Distilled complex geospatial tech into two words — "Map Anything." — and built a 9-collateral marketing playbook.',
    coverImage: "/assets/lepton/slide-1.png",
    visible: true,
    content: {
      tagline: '"Map Anything."',
      sections: [
        {
          heading: "Context",
          body: "Lepton builds geospatial intelligence tools powered by Google Maps APIs — helping businesses visualise operations, supply chains, and logistics.",
        },
        {
          heading: "Challenge",
          body: "The product had powerful capabilities but messaging was too technical. Sales conversations required too much explanation. Enterprise buyers couldn't quickly understand the value.",
        },
        {
          heading: "Brand Positioning",
          body: 'Tagline: "Map Anything." — two words that make a complex offering instantly understandable.\n\nVision: Make the world smarter and more productive with futuristic visualisation software.',
        },
        {
          heading: "Marketing Playbook — 9 Collaterals",
          body: "Lead Gen: Sales pitch, Battle cards, Brochures\nLead Conversion: Pre-built Emails, Demo, Testimonial Ads\nBrand Awareness: Workshops, Social Media, Team alignment",
        },
      ],
      videos: [
        {
          type: "youtube",
          id: "ZyC9cvJwfMU",
          label: "Zomato Delivery Film",
        },
      ],
      images: [
        "/assets/lepton/slide-1.png",
        "/assets/lepton/slide-2.png",
        "/assets/lepton/slide-3.png",
        "/assets/lepton/slide-4.png",
      ],
    },
  },
  {
    slug: "zero-se-restart",
    title: "Story & Marketing for a Bollywood Film",
    client: "Vinod Chopra Films",
    role: "Creative Associate — co-developed sub-plots, shot scenes, created subtitles, supported promo strategy",
    categories: ["Campaigns"],
    summary:
      "Worked on-set and in the cutting room for a documentary on 12th Fail — winner of Stuttgart Film Festival 2025, now on Amazon Prime.",
    coverImage: "/assets/zero-se-restart/poster.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Film",
          body: "Zero Se Restart documents the making of 12th Fail — a critically acclaimed Bollywood film. Won Audience Award at Stuttgart Film Festival 2025. Now streaming on Amazon Prime Video.",
        },
        {
          heading: "Aditya's Role",
          body: "Co-developed sub-plots, shot scenes on set, created subtitles. Contributed to teasers, BTS content, and campaign assets. Supported end-to-end promo strategy.",
        },
        {
          heading: "Marketing Approach",
          body: "Marketed the film as a crash course on filmmaking. Screened at film schools, festivals, and cinemas. Embedded QR code at end of film during screenings → built WhatsApp channel of cinema lovers.",
        },
      ],
      videos: [
        { type: "youtube", id: "qdpquhyZaoY", label: "Trailer / Promo" },
        { type: "youtube", id: "iQuEu452Duc", label: "Music Video" },
      ],
      extraLinks: [
        {
          label: "Watch on Prime Video →",
          url: "https://www.primevideo.com/region/eu/detail/0RK5T1KQ1WG63K0RKDPVUNO88Z/ref=atv_dp_share_cu_r",
        },
      ],
    },
  },
  {
    slug: "blanket-wars",
    title: "Event & Digital Marketing for a Music Release",
    client: "Self-initiated (Aditya's own music)",
    role: "Artist + Campaign Architect",
    categories: ["Campaigns"],
    summary:
      "3-stage release campaign for my own song — sold out a live show, 5K+ streams in week one, featured on YouTube's New Release playlist next to Ed Sheeran.",
    coverImage: "/assets/blanket-wars/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "Pre-release",
          body: "Song took 3 years to make, shaped by 24 collaborators. 24-day Instagram countdown — thanked one collaborator per day, drove pre-saves. Used genre-matching tracks in countdown creatives.",
        },
        {
          heading: "Release",
          body: "Dropped teaser capturing the 3-year journey. Pushed via WhatsApp broadcasts. Offline: flyer distribution across colleges and popular spots in Delhi.",
        },
        {
          heading: "Post-release",
          body: "Partnered with Delhi startup Pauseu for a ticketed live show. Intimate experience built around the music — postcards, conversation. Drove ticket sales via Meta ads and BookMyShow.",
        },
      ],
      stats: [
        { label: "Live Event", value: "Sold out" },
        { label: "Week 1 Streams", value: "5K+" },
        { label: "Playlist Feature", value: "YouTube New Release (alongside Ed Sheeran)" },
      ],
      videos: [{ type: "youtube", id: "A9IijGc-AMU", label: "Blanket Wars" }],
      spotifyTrackId: "4UVOaexjzjrr1Il7YfcyQf",
      extraLinks: [
        {
          label: "Buy Tickets — BookMyShow →",
          url: "https://in.bookmyshow.com/events/letters-lyrics-latte-home-edition/ET00451501",
        },
      ],
    },
  },
  {
    slug: "big-muscles",
    title: "Ads & Strategy for a Fitness Brand",
    client: "Big Muscles | Agency: L&K Saatchi & Saatchi, Mumbai",
    role: "Copywriter / Creative Strategist",
    categories: ["Ads"],
    summary:
      'Flipped the protein brand narrative from endurance to inner strength — "You\'re stronger than you think" — featuring Ranveer Singh.',
    coverImage: "/assets/big-muscles/cover.jpg",
    visible: true,
    content: {
      tagline: '"You\'re stronger than you think"',
      sections: [
        {
          heading: "Strategy",
          body: 'Every protein brand was saying "train longer" — Big Muscles flipped the narrative from endurance to inner strength. The insight: "What really limits you isn\'t your body. It\'s your mind."',
        },
        {
          heading: "The Films",
          body: "Both films tap into the inner voice — the moment you're about to give up, and the flip to pushing through. Ranveer Singh stars in both.",
        },
      ],
      videos: [
        { type: "youtube", id: "9jtVAy4pSRA", label: 'Film 1 — "I Can\'t Quit"' },
        { type: "youtube", id: "dtmY_xwqDlU", label: 'Film 2 — "No More Excuses"' },
      ],
    },
  },
  {
    slug: "homelane",
    title: "Campaigns & Communication for an Interiors Brand",
    client: "HomeLane",
    role: "Copywriter / Campaign Lead",
    categories: ["Ads", "Copy", "Campaigns"],
    summary:
      "Wrote and led campaigns across cricket, Valentine's, and Earth Day for India's largest interior design brand.",
    coverImage: "/assets/homelane/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "Campaigns",
          body: "Wrote and led multiple campaigns: HomeLane Valentine's Day, AFC Cricket World Cup 2023, Personalisation Video, HomeLane Luxe, Earth Day.",
        },
      ],
      adCopy: {
        lines: [
          "CLEAN DELIVERY — Interior in 45 days or we pay you rent | Packages from ₹3.5L | 0% EMI",
          "SCORE BIG — with a flat 10-year material warranty (Cricket World Cup tie-in) | Packages from ₹3.5L",
          "RELAX & ENJOY THE GAME — 0% interest EMI option on Interiors",
          "Interiors made ~~easy~~ easier — ZERO COST EMI AVAILABLE | 2BHK from ₹3.5L",
        ],
      },
      images: ["/assets/homelane/cover.jpg"],
    },
  },
  {
    slug: "troost",
    title: "Ad Film Script & Direction for a Rug Brand",
    client: "Troost (Troost.in) — handwoven chenille rugs",
    role: "Ad Film Scriptwriter & Director",
    categories: ["Ads"],
    summary:
      "Wrote the full Hinglish script and directed 6 YouTube ad films for a handwoven rug brand.",
    coverImage: "/assets/troost/cover.jpg",
    visible: true,
    content: {
      scriptQuote:
        '"Ye itna spacious kaise lagra hai? Did you sell something?"\n"No yaar. I just replaced our jute rug with a handwoven chenille rug."',
      sections: [
        {
          heading: "The Brief",
          body: "Troost sells handwoven chenille rugs. Aditya wrote the full Hinglish ad film script and directed 6 video ads.",
        },
        {
          heading: "The Concept — The Spacious Room",
          body: "Two flatmates. Actor 1 (The Coder) walks into the flat and thinks he's in the wrong house — it looks so different, so spacious. He realises it's because of the new rug.",
        },
        {
          heading: "Product USPs in Script",
          body: "Machine washable · Fade-resistant colours · 15+ designs · 50% off + free anti-skid rug pad",
        },
      ],
      videos: [
        { type: "shorts", id: "kutiaQSsiJM", label: "Our best selling rug" },
        { type: "shorts", id: "WVQICb-OyF4", label: "Tapped it to the floor" },
        { type: "shorts", id: "3AR0LwkH-kY", label: "Come back story" },
        { type: "shorts", id: "qKTgHc63SaQ", label: "Investor rejected us" },
        { type: "shorts", id: "2gv8KC-ZUCA", label: "Customer care" },
        { type: "shorts", id: "GervzgrnakY", label: "Mummy gussa ho gai" },
      ],
      extraLinks: [
        { label: "Troost on Instagram →", url: "https://www.instagram.com/troostofficial/" },
      ],
    },
  },
  {
    slug: "black-water-bottle",
    title: "Built a D2C Water Bottle Brand End-to-End",
    client: "Self (Founder)",
    role: "Founder — product concept, copy, brand identity, GTM",
    categories: ["Copy", "Ads"],
    summary:
      "39 punchy copy lines, one minimal black bottle brand, real Shopify orders — built from scratch in 6 months.",
    coverImage: "/assets/black-water-bottle/mockups/thirsty-kya.png",
    visible: true,
    content: {
      sections: [
        {
          heading: "What It Is",
          body: "A DTC e-commerce brand selling premium black water bottles. Each bottle has a different punchy copy line printed on it. The product is as much about the words as the object. Used as a sandbox for AI-driven content workflows.",
        },
        {
          heading: "Brand Identity",
          body: 'Minimal black-on-black. Logo: "Black Water Bottle Co." Bottles personalised with witty copy — makes hydration a personality statement.',
        },
        {
          heading: "Results",
          body: "Real Shopify orders confirmed (from order PDFs and GST invoices). Wrote 39 product copy lines, built the brand, got real orders.",
        },
      ],
      images: [
        "/assets/black-water-bottle/mockups/thirsty-kya.png",
        "/assets/black-water-bottle/mockups/mere-pass-paani-hai.png",
        "/assets/black-water-bottle/mockups/water-you-looking-at.png",
        "/assets/black-water-bottle/mockups/chuglife.png",
        "/assets/black-water-bottle/mockups/not-vodka-probably.png",
        "/assets/black-water-bottle/mockups/stay-thirsty.png",
        "/assets/black-water-bottle/mockups/pa-ni.png",
        "/assets/black-water-bottle/mockups/og-thirst-trap.png",
      ],
      copyLines: {
        featured: [
          "Thirsty Kya?",
          "Mere pass paani hai",
          "Water You Looking At",
          "ChugLife",
          "Not Vodka Probably",
          "Stay Thirsty, Stay Foolish.",
          "Pa Ni",
          "OG Thirst Trap",
        ],
        all: [
          "Thirsty Kya?",
          "Stay Thirsty, Stay Foolish.",
          "ChugLife",
          "OG Thirst Trap",
          "Not Vodka Probably",
          "Sip Smile Repeat",
          "DrinkLikeAMachhli",
          "Fill Me Up Again",
          "Mere pass paani hai",
          "Hello friends paani pilo",
          "Jal Jeevan hai",
          "Thanda Matlab Paani",
          "Piyoge kya?",
          "Paani peevanu majjani life",
          "Pa Ni",
          "Its time for water break",
          "Water your brain cells",
          "Water your thoughts",
          "Water your weekend plans",
          "Happy clients Water that",
          "HR support_Water those",
          "Water the deadlines?",
          "Water the chances!",
          "Keep Calm And Drink Water",
          "Water You Looking At",
          "Water you drinking?",
          "Water you saying!!!",
          "Water you wearing",
          "Water Your Weaknesses",
          "Water keeps me sane",
          "Free Refills Go Nuts",
          "Caution! Hydrogen Hydroxide Inside",
          "I love H2O",
          "4 Reps Daily",
          "1 Down 3 To Go",
          "Dont stop till Im empty",
          "100% self love",
          "Shut Up And Swallow",
          "Fill roughly swallow slowly",
        ],
      },
    },
  },
  {
    slug: "nexttt-one",
    title: "COO & Creative Director at a Talent Agency — From the Inside",
    client: "Nexttt One (Nexttt One Talent Agency, Delhi)",
    role: "COO & Creative Partner — operations, systems, creative direction, product creation, in-house marketing",
    categories: ["Ads", "Campaigns"],
    summary:
      "Embedded as COO at a ₹18–20L/month talent agency — running operations, writing copy, directing video, building new products, and leading a 12-person team.",
    coverImage: "/assets/nexttt-one/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Agency",
          body: "Based in Chhatarpur, New Delhi. 12-person team across 6 verticals: Models, Ads, Workshop, Portfolio, Academy, Operations. Revenue: ₹18–20L/month | Costs: ~₹15L | Margin: ~₹3–5L. Pivoting from modeling agency → talent + content company.",
        },
        {
          heading: "Angle 1 — The Copy Product",
          body: "Wrote the full brand brief and copy for Nexttt One's first paid workshop, \"Face the Camera\" (July 2026).",
        },
        {
          heading: "Angle 3 — The Strategy",
          body: "Diagnosed the agency's need to pivot. Wrote a 5-pillar Strategic Reboot document to shift from modeling agency to fashion content & influencer incubator.",
        },
      ],
      workshopCopy:
        "You already have the look. The camera already notices you. But the moment a photographer gives you a direction — or a director calls action — something shifts. You overthink. You go stiff. You lose the version of yourself that makes people stop scrolling. This workshop exists for that gap.\n\nTagline: \"You already have the look. This weekend, you get the skill.\"\n\nWorkshop details: ₹5,000 | 2 days | 15 seats | Chhatarpur, New Delhi",
      metaResults: [
        { label: "Video A — Leads", value: "11 leads @ ₹16.46/lead" },
        { label: "Video A — Spend", value: "₹181.16 | 3,929 impressions" },
        { label: "Video B — Leads", value: "1 lead @ ₹37.62/lead" },
        { label: "Performance", value: "Video A performed 2.3x better per rupee" },
      ],
      strategyPillars: [
        "Influencer Module Upsell (NTA upgrade)",
        "Masterclasses at Fashion Colleges (NIFT, Pearl Academy, AAFT)",
        "Performance Models for digital video ads",
        "Shoot-at-Sight Bundles (flat-rate Reels packages)",
        "White-Label Fashion Show Curation",
      ],
      videos: [
        { type: "shorts", id: "dXEX4jdIZcQ", label: "NTA Batch 4 closing soon!" },
      ],
      extraLinks: [
        { label: "Nexttt One Website →", url: "https://www.nextttone.com/" },
        { label: "Instagram (Academy) →", url: "https://www.instagram.com/nextttone.talent.academy/" },
        { label: "Instagram (Main) →", url: "https://www.instagram.com/nexttt.one/" },
      ],
    },
  },
];
