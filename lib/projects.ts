export type Category = "Branding" | "Films" | "Campaigns" | "Operations";

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
  result?: string;
  coverImage: string;
  visible: boolean;
  content: {
    tagline?: string;
    sections: { heading: string; body: string }[];
    adCopy?: { lines: string[] };
    stats?: { label?: string; value: string; prefix?: string }[];
    keyTakeaway?: string;
    keyTakeawayAttribution?: string;
    videos?: VideoEmbed[];
    images?: string[];
    imagesAfterSection?: string;
    proofBlocks?: { title?: string; text: string; videoId?: string; images?: string[] }[];
    brandBlock?: { vision: string; mission: string; tagline: string; taglineDesc: string };
    salesPitch?: { intro: string; subject: string; subjectLead: string; steps: { step: string; desc: string }[]; closingLine?: string; closingVideoId?: string };
    funnelIntro?: string;
    playbookNote?: string;
    funnelGroups?: { stage: string; items: { title: string; desc: string }[] }[];
    funnelCaseStudy?: { caption: string; note: string; images: string[] };
    campaignSpotlight?: { title: string; body: string };
    musicStages?: {
      stage: string;
      title: string;
      body: string;
      videos?: { id: string; portrait?: boolean }[];
      videosFirst?: boolean;
      images?: string[];
      media?: { type: "image" | "video"; src?: string; id?: string; portrait?: boolean; caption?: string; label?: string; desc?: string }[];
      mediaLayout?: "grid" | "stack";
      note?: string;
      result?: string;
      resultImage?: string;
      link?: { label: string; url: string };
    }[];
    nextttChapters?: {
      eyebrow?: string;
      title: string;
      blocks: (
        | { kind: "sub"; text: string; deep?: boolean }
        | { kind: "para"; text: string }
        | { kind: "list"; items: string[]; ordered?: boolean }
        | { kind: "reels"; reels: { label: string; url: string; youtube?: string }[] }
        | {
            kind: "table";
            firstHead: string;
            numHeads: string[];
            rows: { name: string; status: string; stopped?: boolean; nums: string[]; groupBefore?: string }[];
          }
        | { kind: "film"; id: string; label?: string }
        | { kind: "carousel"; images: string[] }
        | { kind: "image"; src: string; caption?: string; width?: "xs" | "sm" | "md" }
        | { kind: "week"; rows: { day: string; what: string }[] }
      )[];
    }[];
    videosEyebrow?: string;
    videosTitle?: string;
    spotifyCopy?: string;
    songYoutubeUrl?: string;
    spotifyTrackId?: string;
    spotifyImage?: string;
    extraLinks?: { label: string; url: string }[];
    scriptQuote?: string;
    workshopCopy?: string;
    metaResults?: { label: string; value: string }[];
    strategyPillars?: string[];
    homelane?: {
      campaigns: { title: string; desc: string; videoSrc?: string; youtubeId?: string; isShort?: boolean; images?: string[] }[];
      brandExtensions: { title: string; desc: string; images: string[]; browserFrame?: boolean }[];
      productAds: { product: string; images: string[]; connected?: boolean }[];
      performanceImages?: string[];
      performanceVideos?: string[];
      festivalImages: string[];
    };
  };
};

export const projects: Project[] = [
  {
    slug: "troost",
    title: "Turning 7 Scripts Into 7 Reels in One Day",
    client: "Troost — a handwoven chenille rug brand",
    role: "Creative Director",
    categories: ["Films"],
    summary:
      "Creative Director — screenplay, casting, shoot, delivery.",
    result: "Delivered 14 reel ads",
    coverImage: "/assets/troost/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Client",
          body: "Troost runs on performance marketing. Every two weeks, 7 new short form ads go live on Meta. What performs keeps running. The rest gets shelved.",
        },
        {
          heading: "The Brief",
          body: "Own the full pipeline, script to final edit, for their 7-ad batch.",
        },
        {
          heading: "The Prep",
          body: "Troost sent scripts inspired by their best performing ads. I turned each one into a unique screenplay. Scene breakdowns: Shoot live, use AI, or add in post? What sound, cast, lenses? How long each setup needs? Which actor arrives when? Etc.\n\nThen I sequenced all 7 scripts into one shoot day.\n\nIn parallel, I cast actors through Instagram and acting groups, scouted studios with the founders, and shared final lines with the cast before shoot day.",
        },
        {
          heading: "Shoot Day",
          body: "Camera, lighting, actors, founders, all on set. I directed everything. Angles, lighting, performance. 7 reels shot in one day. Within time, within budget.",
        },
        {
          heading: "The Edit",
          body: "Assigned one reel per editor. I reviewed the cuts for pacing and sound. Every ad went live.",
        },
      ],
      keyTakeaway: "Delivered two 7-ad batches.",
      videos: [
        { type: "shorts", id: "kutiaQSsiJM", label: "Our best selling rug" },
        { type: "shorts", id: "WVQICb-OyF4", label: "Tapped it to the floor" },
        { type: "shorts", id: "3AR0LwkH-kY", label: "Come back story" },
        { type: "shorts", id: "qKTgHc63SaQ", label: "Investor rejected us" },
        { type: "shorts", id: "2gv8KC-ZUCA", label: "Customer care" },
        { type: "shorts", id: "GervzgrnakY", label: "Mummy gussa ho gai" },
      ],
      extraLinks: [
        { label: "Visit troost.in →", url: "https://www.troost.in/" },
      ],
    },
  },
  {
    slug: "zero-se-restart",
    title: "My Third Film With VCF: The Making of 12th Fail",
    client: "Vinod Chopra Films",
    role: "Creative Associate",
    categories: ["Films"],
    summary:
      "Creative Associate — writing, directing, marketing.",
    result: "Now on Amazon Prime",
    coverImage: "/assets/zero-se-restart/poster.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "How I Got Here",
          body: "I shot BTS on Shikara and 12th Fail. For Zero Se Restart (ZSR), director Jaskunwar Singh Kohli pulled me in as Creative Associate.",
        },
        {
          heading: "The Film",
          body: "What started as a YouTube series grew into a feature-length documentary on how Vinod Chopra directed 12th Fail. Everyone told him not to. He directed it anyway.\n\n150+ script drafts. Recces, replanning, casting. Vinod Chopra pulling performances out of Vikrant Massey and the cast. A slow theatrical release, an OTT explosion, then the awards. [[ZSR captures it all.]]",
        },
        {
          heading: "The Filmmaking",
          body: "Sat with the director on where the story could go. Developed subplots. Shot studio recordings with Shankar Mahadevan, Sonu Nigam and Shaan, three of India's biggest voices. Earned a cinematography credit for that. Co-directed the trailer. Contributed to the music video and teasers.",
        },
        {
          heading: "The Marketing",
          body: "I presented marketing ideas to Vinod Chopra. The best ones went to marketing meetings, where the whole team sat. Then I reworked our ideas around what the team decided.\n\nFirst angle: the story behind the story. Viewers got confused. Fiction or reality? We dropped it.\n\nSecond: a master class by Vinod Chopra. 45 years in Bollywood, breaking down how he made 12th Fail. Felt preachy. Dropped it.\n\nThird, now the trailer on Amazon Prime: never give up. The unfiltered making of a film that was never supposed to be made, by a man who was never supposed to make it.",
        },
        {
          heading: "The QR Idea",
          body: "ZSR was screening at film schools, festivals and cinemas. We wanted a community around the film. My idea: a QR code on the last frame. Scan to share your appreciation. It took viewers to a WhatsApp channel where they could message the crew directly. Hundreds joined. Beautiful messages came in.",
        },
        {
          heading: "The ₹20 Note",
          body: "Throughout ZSR, you see Vinod Chopra hand out ₹20 notes to anyone who does something great. Toward the end, I earned mine.",
        },
        {
          heading: "Favourite Memory",
          body: "Spotting character arcs in ordinary people while watching the BTS footage. Nobody knew we'd end up making a film out of the footage. Not the cast, not the crew. They were just at work on 12th Fail. But life has drama. It has dialogue. It has unfiltered moments that can’t be recreated. Being able to spot them was my favourite memory. Then pulling those shots into story beats in the final cut.",
        },
      ],
      keyTakeaway: "First health, then family, then film.",
      keyTakeawayAttribution: "— VVC's mantra",
      videos: [
        { type: "youtube", id: "qdpquhyZaoY", label: "Trailer / Promo" },
        { type: "youtube", id: "iQuEu452Duc", label: "Music Video" },
      ],
      extraLinks: [
        {
          label: "Watch ZSR on Prime Video →",
          url: "https://www.primevideo.com/region/eu/detail/0RK5T1KQ1WG63K0RKDPVUNO88Z/ref=atv_dp_share_cu_r",
        },
      ],
    },
  },
  {
    slug: "big-muscles",
    title: "Wrote the Tagline and TVC Scripts for Big Muscles",
    client: "L&K Saatchi & Saatchi",
    role: "Senior Copywriter",
    categories: ["Campaigns", "Films"],
    summary:
      "Senior Copywriter — strategy, tagline, films.",
    result: "2 National TVCs with Ranveer Singh",
    coverImage: "/assets/big-muscles/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Strategy",
          body: "The protein category was crowded. Every brand promised the same thing. Train longer. More endurance. Faster gains. Best protein extract. All talking to the muscle.\n\nBig Muscles needed a way in. The insight I cracked became the strategy: what really limits you isn't your body. It's your mind.",
        },
        {
          heading: "The Tagline",
          body: "You're stronger than you think.\n\nThe inner voice. The moment you hesitate. The moment you almost quit. That's when this pulls you back.",
        },
        {
          heading: "The Films",
          body: "Two national TVCs. Both with Ranveer Singh. Same premise: the moment you're about to give up, and the flip.\n\nFilm 1: [[I Can't]] Quit.\nFilm 2: [[No More]] Excuses.\n\nI wrote both scripts. The CD and production house handled the shoot.",
        },
      ],
      keyTakeaway: "My first scripts to get produced.",
      videos: [
        { type: "youtube", id: "9jtVAy4pSRA", label: 'Film 1 — "I Can\'t Quit"' },
        { type: "youtube", id: "dtmY_xwqDlU", label: 'Film 2 — "No More Excuses"' },
      ],
    },
  },
  {
    slug: "oyo",
    title: "A Viral Campaign That Got Couples A Room",
    client: "OYO Rooms",
    role: "Copywriter",
    categories: ["Campaigns"],
    summary: "Copywriter — strategy, concept, copy.",
    result: "Launched Couple-Friendly OYOs · Crossed 250K+ bookings/month",
    coverImage: "/assets/oyo/hero-v6.webp",
    visible: true,
    content: {
      sections: [
        {
          heading: "Context & Problem",
          body: "Unmarried couples across India couldn't find hotel rooms reliably. Local ID check-ins were denied. The experience was uncertain, even hostile sometimes.\n\nDemand existed. But the behaviour was suppressed.",
        },
        {
          heading: "Role",
          body: "The job was to make people comfortable with an idea that was suppressed for decades.",
        },
        {
          heading: "Strategy",
          body: "Shift the idea from hidden to widely accepted.\n\nThree moves:\n1. Remove ambiguity.\n2. Signal safety.\n3. Normalise behaviour.",
        },
        {
          heading: "The Product",
          body: "[[Couple Friendly OYOs.]] A toggle on the app. Users could filter for hotels that accepted local ID check-ins for unmarried couples.",
        },
        {
          heading: "The Writing",
          body: "The response had to feel like it came from a friend. Not a warning. Not a lecture. More like a wink.\n\nAfter hundreds of options, one line landed. I said it casually in a creative meeting, discussing problems for unmarried couples: \"Now when someone says get a room, you can actually get a room!\"\n\n[[Get A Room.]]\n\nThat became the campaign.\n\nAfter the tagline landed, the headlines were so much fun to write.",
        },
        {
          heading: "The Ads",
          body: "Simple, humour-packed. Each ad came from real-life experience and observation.",
        },
        {
          heading: "Execution",
          body: "Digital ads, push notifications, social media, in-app messaging, SMS, blogs, and email. Consistent messaging across every touchpoint reinforced the idea.",
        },
      ],
      stats: [
        { prefix: "The campaign went", value: "Viral" },
        { value: "Couple Friendly Toggle", label: "Became a nationwide category" },
        { value: "250K+", label: "Bookings/month · crossed for the first time" },
        { prefix: "Normalised local ID check-ins", value: "Across India" },
      ],
      keyTakeaway: "Sometimes, a few right words can change behaviour across a country.",
      images: [
        "/assets/oyo/OYO Ad1.png",
        "/assets/oyo/OYO Ad2.png",
        "/assets/oyo/OYO Ad3.png",
        "/assets/oyo/OYO Ad4.png",
      ],
      imagesAfterSection: "The Ads",
    },
  },
  {
    slug: "homelane",
    title: "Built Ads That Drove Revenue and Brand Equity",
    client: "HomeLane",
    role: "Creative Supervisor, Copy",
    categories: ["Branding", "Campaigns", "Operations"],
    summary: "Creative Supervisor — campaigns, sub-brand launches, performance ads.",
    result: "1.2 years · 10+ campaigns · 2 sub-brands",
    coverImage: "/assets/homelane/hero-v2.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "My Role",
          body: "One of India's biggest interiors brands, HomeLane spoke through many channels. [[I kept the voice one.]]\n\nAll ads and brand communications were routed through me for the final edit. I pitched ideas, built campaigns, wrote performance ads, the website copy, and supervised a team of 3 designers.\n\nI owned every message a customer got. From the first reply after an ad click, to the purchase, to the service offer after one year. Every email, every WhatsApp.",
        },
      ],
      homelane: {
        campaigns: [
          {
            title: "Valentine's Made Easy",
            desc: "It's impossible to find a dinner reservation on Valentine's day. Right? Not if you're a HomeLane customer. Every HomeLane store had a living room on display. We converted them into a romantic dining spot and invited our customers who were mid-project to spend the evening in a living room that could soon be their own. I pitched it to our team. The CMO aligned operations and the Creative Director ran it with a producer. We filmed the activity. I wrote the film.",
            youtubeId: "O0iYoiDberU",
          },
          {
            title: "Modular Like Lego",
            desc: "With modular interiors, you build your home like you played Lego. Executed with one designer. A performance ad that did branding too.",
            youtubeId: "McWtOj2QEaQ",
            isShort: true,
          },
        ],
        // Performance ads: these video Shorts render first, then the images
        // pulled automatically from public/assets/homelane/performance-ads/
        performanceVideos: ["ykIkfhLEdMc", "R2vAgEjqmxc"],
        productAds: [
          {
            product: "Customisable Wardrobe",
            images: ["/assets/homelane/versa-wa.gif", "/assets/homelane/versa-benefits.png"],
            connected: true,
          },
          {
            product: "Modular Bed",
            images: ["/assets/homelane/modular-bed-1.png", "/assets/homelane/modular-bed-2.png"],
            connected: true,
          },
        ],
        brandExtensions: [
          {
            title: "HomeLane Luxe",
            desc: "The premium sub brand. High end, deeply personalised interiors.",
            images: [
              "/assets/homelane/luxe-emailer.jpg",
            ],
          },
          {
            title: "Cubico by HomeLane",
            desc: "The workspace sub brand. Sharp, functional, for people who mean business.",
            browserFrame: true,
            images: [
              "/assets/homelane/cubico-1.png",
              "/assets/homelane/cubico-2.png",
              "/assets/homelane/cubico-3.png",
              "/assets/homelane/cubico-4.png",
              "/assets/homelane/cubico-5.png",
            ],
          },
        ],
        festivalImages: [
          "/assets/homelane/festival-newyear.jpg",
          "/assets/homelane/festival-republic.jpg",
        ],
      },
      keyTakeaway: "One brand. One voice.",
      extraLinks: [
        { label: "Visit homelane.com →", url: "https://www.homelane.com/" },
      ],
    },
  },
  {
    slug: "nepal-election",
    title: "Scaling a Political Campaign to 16M Views in 60 Days",
    client: "Birender Kanodia — MP candidate, Nepal General Election 2026",
    role: "Digital Campaign Lead",
    categories: ["Films", "Campaigns", "Operations"],
    summary: "Digital Campaign Lead — strategy, content, distribution, 12-member team.",
    result: "1.9M views on the campaign's final day",
    coverImage: "/assets/nepal/hero-v3.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Situation",
          body: "In 2025, Nepal's government was overthrown by a Gen Z protest that started online. Every politician in the country had seen what the internet could do. A year later came the general election. My candidate was fighting for the MP seat from Kapilvastu. Nepal lives on Facebook, then TikTok, then YouTube. His Facebook page had 25K followers and zero engagement. There was no YouTube channel. No official TikTok page. Only supporter pages.",
        },
        {
          heading: "The Plan",
          body: "A three pillar content system. Quick content daily. Big assets weekly.",
        },
        {
          heading: "Pillar 1: The Candidate's Story",
          body: "For authority. Rallies cut into high energy films. Interviews cut into 30 second reels, key points in the header so they worked on mute. Fast replies to the opposition's allegations. The candidate stayed present and in charge of his own narrative.",
        },
        {
          heading: "Pillar 2: The Audience's Voice",
          body: "For trust. 30 second reels with farmers, students and village leaders answering one question. Why do you support him? Praise from a neighbour beats praise from a poster. We extensively shared verified news from trusted media channels too.",
        },
        {
          heading: "Pillar 3: Policy",
          body: "For clarity. We turned the manifesto into AI generated films. Complex ideas became simple visual stories. We placed QR codes at the end so anyone could download the full manifesto.",
        },
        {
          heading: "The Content Engine",
          body: "I led a 12 member team. Plan in the morning. Shoot rallies and interviews through the day. Cut long content into short. Publish everywhere. Watch the opposition, flag misinformation, answer with content the same day. The same footage fed an agency I worked with for the bigger assets. Strategic campaigns, authority films, AI policy videos. Their builds took three to four days. Some AI films shipped in 48 hours.",
        },
        {
          heading: "Distribution",
          body: "Facebook was the heart of the campaign. Everything went there first. I created the YouTube channel and the official TikTok page, and repurposed everything for both. Reels first, for reach. Live sessions during rallies and speeches, for real time engagement. Multiple accounts, for scale.",
        },
        {
          heading: "The Boosts",
          body: "We ran Facebook ads too, spending 50K+ per week. We boosted only what had already proven itself organically. Content that drove shares and followers first. Then content that sparked debate and shifted opinions. I did the audience targeting myself. The spend grew as voting day came closer.",
        },
        {
          heading: "The Last Day",
          body: "Election rules stop campaigning before voting day. So we built the whole curve to peak on the last legal day. On 3rd March, the page did 1.9 million views in a day. It started the campaign with one view on day one.",
        },
      ],
      stats: [
        { value: "15.9M+", label: "Views in 60 days" },
        { value: "+989,302%", label: "Growth over previous 60 days" },
        { value: "571K+", label: "Engagement" },
        { value: "81%", label: "Of new followers came from reels" },
      ],
      keyTakeaway: "Built momentum. One post at a time.",
      videos: [
        {
          type: "youtube",
          id: "1qzrExsy2bQ",
          label: "Rally Film, shot and edited in one day",
          fbUrl: "https://www.facebook.com/share/v/18bGeJdZ4J/",
          fbViews: "137K",
        },
        {
          type: "youtube",
          id: "0w0SG8_AnSI",
          label: "Answering the Opposition",
          fbUrl: "https://www.facebook.com/share/r/1AxaVsq8pr/",
          fbViews: "284K",
        },
        {
          type: "youtube",
          id: "VzGQHQM2ocM",
          label: "Why I Support Him, on-ground voices",
          fbUrl: "https://www.facebook.com/share/r/1BtzzBTsf5/",
          fbViews: "273K",
        },
        {
          type: "youtube",
          id: "Y5tzf4OkJCs",
          label: "Manifesto Film 1: The Vision",
          fbUrl: "https://www.facebook.com/share/v/1CgqwGvQok/",
          fbViews: "115K",
        },
        {
          type: "youtube",
          id: "Aqh6OtD69Kw",
          label: "Manifesto Film 2: Sports",
          fbUrl: "https://www.facebook.com/share/v/1HapgpkAit/",
          fbViews: "269K",
        },
        {
          type: "youtube",
          id: "JvyuMH9oZkE",
          label: "Manifesto Film 3: Farm Lands",
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
    title: "Made a Complex Geospatial SaaS Easy to Sell",
    client: "Lepton Software",
    role: "Marketing Consultant",
    categories: ["Branding", "Films"],
    summary: "Marketing Consultant — branding, sales pitch, client outreach.",
    result: "SaaS used by Airtel, Vodafone, HDFC, Zomato and more.",
    coverImage: "/assets/lepton/hero-v3.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Products",
          body: "Lepton builds geospatial intelligence products powered by Google Maps APIs.\n\nIts suite of products, including Location Intelligence, SmartCampus, SmartMarket and more, helps enterprises optimise operations, improve decision-making, and reduce recurring costs.\n\nBusinesses use these products to manage locations, assets, supply chains, logistics, and field operations at scale. Clients include Airtel, Vodafone, OYO, HDFC, and more.",
        },
        {
          heading: "The Problem",
          body: "Lepton's products were powerful, but difficult to explain.\n\nSales conversations revolved around features, APIs, and implementation details. C-suite leaders took long to understand the business value.",
        },
        {
          heading: "The Strategy",
          body: "I shifted Lepton's communication from explaining how the products worked to demonstrating how they helped businesses grow.\n\nThe strategy centred around three pillars:\n\n[[Branding.]] Build a clear positioning business leaders could immediately understand.\n\n[[Sales Pitch.]] Lead with business outcomes, not product capabilities.\n\n[[Customer Acquisition Funnel.]] Create communication for every stage of the buyer journey, from lead generation to conversion.",
        },
      ],
      imagesAfterSection: "The Strategy",
      brandBlock: {
        vision: "To make the world smarter and more productive with futuristic visualisation software and services.",
        mission: "Helping businesses optimise and grow by mapping their assets, operations, clients, and more.",
        tagline: "Map Anything",
        taglineDesc: "Every Lepton product's core proposition, distilled into two simple words. Unified under a single, memorable promise.",
      },
      salesPitch: {
        intro: "I lead the conversation with business outcomes, making the value immediately clear before introducing the technology behind it. An example email for Location Intelligence.",
        subject: "Bridge the Gap with Your Data on the Map",
        subjectLead: "Faster decisions. Lower operating costs. Powered by five key Location Intelligence capabilities.",
        steps: [
          { step: "Map", desc: "Hubs, fleets & routes" },
          { step: "Layer", desc: "Traffic, demand & delivery constraints" },
          { step: "Identify", desc: "Delays, inefficiencies & high-cost routes" },
          { step: "Optimise", desc: "Routing, networks & hub placement" },
          { step: "Scale", desc: "Efficiency, speed and profits" },
        ],
        closingLine: "See how this helped Zomato reduce delivery time by 20%.",
        closingVideoId: "ZyC9cvJwfMU",
      },
      funnelIntro: "I designed the core communication system to support every stage of the buyer journey.",
      playbookNote: "The essential assets, not every possible one. Built to educate prospects, support sales, and grow the business.",
      funnelGroups: [
        {
          stage: "Lead Generation",
          items: [
            { title: "Sales Pitch", desc: "Lead with one number that matters most to them." },
            { title: "Battle Cards", desc: "A feature-to-feature comparison with competitors." },
            { title: "Brochures", desc: "Built for specific business use cases. Sent as emails and targeted ads." },
          ],
        },
        {
          stage: "Lead Conversion",
          items: [
            { title: "Pre-built Emails", desc: "Ready-to-go messages for every touchpoint." },
            { title: "Product Demo", desc: "Business specific demos with free credits to explore." },
            { title: "Testimonial Ads", desc: "Real clients, real problems solved, ending on hard numbers." },
          ],
        },
        {
          stage: "Brand Development",
          items: [
            { title: "Workshops", desc: "Train the next generation of buyers." },
            { title: "Social Media", desc: "Build a community around Lepton products." },
            { title: "Team Alignment", desc: "A monthly sync between sales and marketing on what's working, and what needs tweaking." },
          ],
        },
      ],
      funnelCaseStudy: {
        caption: "Sales Enablement",
        note: "I repackaged customer success stories into simple sales assets the team could easily share with prospects.",
        images: [
          "/assets/lepton/blusmart-1.png",
          "/assets/lepton/blusmart-2.png",
          "/assets/lepton/blusmart-3.png",
          "/assets/lepton/blusmart-4.png",
          "/assets/lepton/blusmart-5.png",
        ],
      },
      campaignSpotlight: {
        title: "GITEX Morocco 2024",
        body: "Lepton was exhibiting at GITEX Morocco 2024 with a simple objective: get telecom decision-makers attending the event to visit our booth.\n\nTo achieve this, we combined SEO, digital PR, LinkedIn advertising, targeted email outreach, and personalised invitations into one coordinated campaign.",
      },
      keyTakeaway: "I realised we weren't talking to engineers. We were talking to the C-suite. So I built the communication accordingly.",
    },
  },
  {
    slug: "blanket-wars",
    title: "Released and Marketed My Own Song",
    client: "Aditya Gopalka",
    role: "Independent Artist",
    categories: ["Films", "Campaigns", "Operations"],
    summary:
      "Independent Artist — community building, multi-platform marketing, ticketed live show.",
    result: "Song featured on YouTube's New Releases. Curated a sold out live show.",
    coverImage: "/assets/blanket-wars/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "The Idea",
          body: "People love songs. But what they love even more are stories. Stories behind the people who worked on it. Stories behind the ideas that developed into a fully produced song.\n\nSo I decided to give people not just the music, but everything they come for.\n\nThrough a three-stage marketing plan:\npre-release, release, and post-release.",
        },
      ],
      musicStages: [
        {
          stage: "Pre-release",
          title: "The 24-Day Countdown",
          body: "The song, three years in the making, was shaped by 24 collaborators.\n\nTold that story through IG posts, thanking one person each day. Turning the process into a 24-day countdown people could follow, while driving pre-saves.",
          mediaLayout: "grid",
          media: [
            { type: "video", id: "-7-c4W4o9wc", portrait: true, caption: "Song Out Tomorrow." },
            { type: "image", src: "/assets/blanket-wars/post-jsk.png", caption: "Creative Consultancy by JSK" },
            { type: "image", src: "/assets/blanket-wars/post-boloy.png", caption: "Mix by Boloy" },
            { type: "image", src: "/assets/blanket-wars/post-meghna.jpg", caption: "Album Art by Meghna" },
          ],
          result: "The posts built momentum, week by week. Beyond new followers, I collected about 1,000 numbers and emails through pre-saves.",
        },
        {
          stage: "Release",
          title: "The Drop",
          body: "The song went live on 150+ platforms. And everything else followed.",
          mediaLayout: "stack",
          media: [
            { type: "video", id: "Q0sF6F-6LVs", label: "Teaser", desc: "Dropped on every social platform, including Reddit." },
            { type: "image", src: "/assets/blanket-wars/whatsapp.png", portrait: true, label: "WhatsApp Broadcast", desc: "Sent to the pre-save list and personal contacts." },
            { type: "image", src: "/assets/blanket-wars/flyer.jpg", portrait: true, label: "Fliers", desc: "Distributed offline, across colleges and popular spots." },
          ],
          note: "Every collateral pointed to just one URL, the YouTube song link. So the views accumulated, and distribution kept amplifying.",
          result: "Achieved 5K+ streams in a few days and landed on YouTube's New Releases, right next to Ed Sheeran.",
          resultImage: "/assets/blanket-wars/youtube-new-releases.png",
        },
        {
          stage: "Post-release",
          title: "The Live Show",
          body: "A month later, I partnered with Pauseu, a Delhi startup, to turn the launch into a ticketed show.\n\nWe designed an intimate evening around music, postcards, and conversation.\n\nMade the reels, ran Meta ads, and sold tickets via BookMyShow and WhatsApp broadcasts.",
          videosFirst: true,
          videos: [
            { id: "RS5vKebBbSU", portrait: true },
            { id: "H_lc9QsVUgA", portrait: true },
          ],
          images: ["/assets/blanket-wars/event-banner.png"],
          result: "Delivered two shows. The first at 50% capacity. The second, sold out.",
          link: {
            label: "See the event on BookMyShow →",
            url: "https://in.bookmyshow.com/events/letters-lyrics-latte-home-edition/ET00451501",
          },
        },
      ],
      keyTakeaway: "Market the stories behind, not just the product.",
      spotifyTrackId: "4UVOaexjzjrr1Il7YfcyQf",
      spotifyCopy: "Now that you know the story, here's the song.",
      songYoutubeUrl: "https://youtu.be/A9IijGc-AMU",
      spotifyImage: "/assets/blanket-wars/song-concept.jpg",
    },
  },
  {
    slug: "beato",
    title: "Built a Timeless Campaign",
    client: "BeatO — a top 100 health-tech startup in chronic healthcare",
    role: "Content Strategist and Copywriter",
    categories: ["Branding", "Campaigns"],
    summary:
      "Content Strategist and Copywriter — strategy, storytelling, team.",
    result: "5 years · Still building community",
    coverImage: "/assets/beato/cover.jpg",
    visible: true,
    content: {
      sections: [
        {
          heading: "Joining BeatO",
          body: "Joined BeatO as Content Strategist and Copywriter during COVID, working remotely. Started by auditing the social channels.\n\nEvery post on Instagram and LinkedIn was selling. Glucometers, diabetes friendly snacks, product launches. Just ads, no strategy.\n\nI rewrote the plan. Instagram would tell inspiring stories of people with diabetes. LinkedIn would build credibility for talent and investors.",
        },
        {
          heading: "My Job",
          body: "Managed a team of 3 designers and 1 writer. Together we built and ran monthly content calendars across Instagram, LinkedIn, Facebook, YouTube, and Twitter. Briefed the PR agency and reviewed their press releases. Personally wrote brand identity, website and app copy, e-commerce product listings, mobile notifications, SMS, in-app banners, newspaper ads, YouTube ads, and internal comms.\n\nEvery piece had to walk one line. Credible without sounding clinical. Empathetic without sounding fearful. I worked with doctors on medical accuracy, product teams on user flows, marketers on tone. No fear selling. No sanitised jargon. Language a friend would use.",
        },
        {
          heading: "Building BeatO Unbeatables",
          body: "I was calling BeatO users to understand how they felt about the product. By call one or two, I noticed something else. They had stories to tell.\n\nSo I interviewed them. Wrote each journey as a magazine style Instagram post. Every post ended with proof. HbA1c before BeatO, and now.\n\nReal people. Real problems. Real heroes. Unbeatable in the face of adversity. I called the format BeatO Unbeatables.\n\nInstagram broke its plateau. <1K to 10K under me. Today it's 27K+. The format worked so well we adapted it everywhere. LinkedIn posts. Blog articles. Now it's a video series. Unbeatables also became a central piece of BeatO's investor pitch deck. Five years after I built the format, it's still running. Dozens of stories published.",
        },
        {
          heading: "LinkedIn, Facebook, Twitter, Chatbot",
          body: "LinkedIn. BeatO Blackboard. Our team was stacked. CXOs from top MBA and engineering colleges, with strong work experience behind them. Blackboard was their thinking on the business topics they knew best. A signal to talent and to seed funders that we had the best of the best.\n\nFacebook. Community building with doctors. Hosted free Zoom Q&As with our experts for anyone following the page. A place to turn when doctors weren't reachable during COVID.\n\nTwitter. Instant updates, viewpoints on COVID, doctor advisories. The news channel.\n\nThe Chatbot. Wrote conversation flows for BeatO's health chatbot. This was before ChatGPT. Basic diagnostics, quick suggestions, routed to a doctor if needed.",
        },
        {
          heading: "What I'm Proudest Of",
          body: "The community proved one idea. Fitness is a choice. Not age, not diagnosis, not circumstance. And earning the trust of the people I wrote about, sensitive stories told with care. Almost every family thanked me after their story went out.",
        },
      ],
      videos: [
        { type: "youtube", id: "w_7O2hBdSPY", label: "BeatO Unbeatables — Mr. Nagale (Video by BeatO)" },
      ],
      extraLinks: [
        { label: "Read Mr. Nagale's story →", url: "https://www.beatoapp.com/blog/beato-unbeatables-the-journey-of-mr-nagale-an-entrepreneur-who-was-diagnosed-with-diabetes-at-the-age-of-47-years/" },
        { label: "Read all BeatO Unbeatables →", url: "https://www.beatoapp.com/blog/category/beato-unbeatables/" },
      ],
    },
  },
  {
    slug: "nexttt-one",
    title: "Business Reboot",
    client: "Nexttt One Talent Academy & Agency",
    role: "Business Consultant",
    categories: ["Campaigns", "Films", "Operations"],
    summary:
      "Business Consultant — revenue, operations, digital marketing, 13-member team.",
    result: "Filled a batch on ₹3,811 of ad spend.",
    coverImage: "/assets/nexttt-one/cover.jpg",
    visible: true,
    content: {
      sections: [],
      nextttChapters: [
        {
          title: "The Business",
          blocks: [
            { kind: "para", text: "**Nexttt One ran two businesses.** Both were in trouble, for different reasons." },
            { kind: "para", text: "**The modelling business was shrinking.** E-commerce shoots were moving to AI. Ad budgets were shifting towards content creators. Print, hoardings, brand films and fashion shows still had work, but budgets were falling." },
            { kind: "para", text: "**The academy had no cash flow.** It ran a three month offline modelling course. Once a batch started, there was nothing more to sell until the next admissions." },
            { kind: "para", text: "**My brief was simple. Make both businesses work.**" },
            { kind: "para", text: "I worked with a 13 member team across business development, sales, digital marketing, content, finance and operations. Together, we made three decisions that changed how the business worked." },
            { kind: "list", ordered: true, items: ["Strengthen the agency.", "Strengthen the academy.", "Make every part of the business work together."] },
          ],
        },
        {
          eyebrow: "Chapter 1",
          title: "Strengthen the Agency",
          blocks: [
            { kind: "sub", text: "Part A. Sell content, not just models." },
            { kind: "para", text: "**Brands were buying finished content.** The agency earned only from model bookings, while most of the budget went to production houses. So we started producing and selling in-house UGC content." },
            { kind: "para", text: "We worked directly with brands to produce creator style videos for social media, opening up a new revenue stream beyond model commissions." },
            { kind: "para", text: "**Delivered content for five to six brands.**" },
            {
              kind: "reels",
              reels: [
                { label: "Supply6", url: "https://www.instagram.com/reel/DZHobsLp5zp/", youtube: "L-kP_X8-8Ok" },
                { label: "Virgio", url: "https://www.instagram.com/reel/DUx2boCDYiZ/" },
                { label: "Ten x You", url: "https://www.instagram.com/reel/DXJfMIxEViS/" },
              ],
            },
            { kind: "sub", text: "Part B. Reach brands instead of waiting for them." },
            { kind: "para", text: "**Current clients & referrals weren't enough.** We built an outbound system to reach brands and agencies directly." },
            { kind: "para", text: "**The outbound system:**" },
            { kind: "list", items: ["Get contact details from Google Maps", "Reach out through calls, Instagram DMs and emails", "Onboard freelance bookers on commission to scale what worked"] },
            { kind: "para", text: "I automated data collection from Google Maps, the booking assistant made phone calls, and the social team DMed 10–15 brands a day on Instagram." },
            { kind: "para", text: "**Almost all UGC clients came through Instagram DMs.**" },
          ],
        },
        {
          eyebrow: "Chapter 2",
          title: "Strengthen the Academy",
          blocks: [
            { kind: "sub", text: "Phase 1. Bring in cashflow." },
            { kind: "para", text: "**The academy had zero cash flow.** Students paid for the course and portfolio together, but there was no fixed payment schedule. Payments were often delayed, while classes and portfolio shoots continued throughout the course. The business kept spending before it had recovered the course fee." },
            { kind: "para", text: "**We repackaged the payment structure and the course module.** Students now paid for classes first and the portfolio later. Separating the two made the pricing easier to understand, gave students the flexibility to complete their portfolio later, and helped the academy recover its course fee much earlier." },
            { kind: "image", src: "/assets/nexttt-one/brochure-batch4.jpg", width: "sm" },
            { kind: "sub", text: "Phase 2. Fill the next batch." },
            { kind: "para", text: "**Batch 4 became our first performance marketing campaign.** We scripted, shot and edited three Meta ads in house. Then we A/B tested all of them, and scaled the winner." },
            {
              kind: "table",
              firstHead: "The call",
              numHeads: ["Cost / lead", "Leads", "Spend"],
              rows: [
                { name: "Ad 1 (vid)", status: "Winner", groupBefore: "A/B Test 1", nums: ["₹11.31", "40", "₹453"] },
                { name: "Ad 2 (vid)", status: "Stopped", stopped: true, nums: ["₹22.64", "9", "₹204"] },
                { name: "Ad 1 (vid)", status: "Retargeted", groupBefore: "A/B Test 2", nums: ["₹9.09", "99", "₹900"] },
                { name: "Ad 3 (still)", status: "Stopped", stopped: true, nums: ["₹13.53", "13", "₹176"] },
                { name: "Ad 1 (vid)", status: "Scaled", groupBefore: "Winner ad", nums: ["₹11.81", "176", "₹2,079"] },
              ],
            },
            { kind: "film", id: "dXEX4jdIZcQ", label: "The winning ad" },
            { kind: "para", text: "People reached: 83,626 | Leads generated: 337 | Ad spend: ₹3,811" },
            { kind: "para", text: "**Then we worked the leads.** Every lead went into a tracking sheet. We called them, confirmed attendance for a demo class, followed up, collected advance payments and filled the batch." },
            { kind: "para", text: "337 Leads | 50 Came for demo | 11 Students enrolled" },
            { kind: "sub", text: "Phase 3. Sell between batches." },
            { kind: "para", text: "Once admissions closed, the academy had nothing left to sell for the next three months. So we built two businesses that could run between batches." },
            { kind: "sub", text: "1. PORTFOLIOS by Nexttt One", deep: true },
            { kind: "para", text: "**Got our in-house stylist to lead this project.** Together, we fixed the deliverables, pricing, creatives and the freelancers required to run portfolio shoots in our studio. Then launched the portfolio business with two offerings:" },
            { kind: "list", items: ["The Fresh Face for beginners", "The Nexttt Face for professionals."] },
            {
              kind: "carousel",
              images: [
                "/assets/nexttt-one/portfolio-deck/1.jpg",
                "/assets/nexttt-one/portfolio-deck/2.jpg",
                "/assets/nexttt-one/portfolio-deck/3.jpg",
                "/assets/nexttt-one/portfolio-deck/4.jpg",
                "/assets/nexttt-one/portfolio-deck/5.jpg",
                "/assets/nexttt-one/portfolio-deck/6.jpg",
                "/assets/nexttt-one/portfolio-deck/7.jpg",
                "/assets/nexttt-one/portfolio-deck/8.jpg",
              ],
            },
            { kind: "sub", text: "2. Nexttt One Workshops", deep: true },
            { kind: "para", text: "**Got one of the mentors to lead this project.** Together, we built one workshop module, designed the business around it, and launched it on District by Zomato." },
            { kind: "image", src: "/assets/nexttt-one/workshop-district-vertical.jpg", width: "sm", caption: "By top models and international mentors. ₹5,000 per person." },
          ],
        },
        {
          eyebrow: "Chapter 3",
          title: "Make every part work together",
          blocks: [
            { kind: "sub", text: "1. One studio. Shared in a weekly rhythm." },
            { kind: "para", text: "The same studio, mentors and creative team powered every offering." },
            {
              kind: "week",
              rows: [
                { day: "Monday", what: "Portfolio levelling, styling and polaroids" },
                { day: "Tuesday", what: "Portfolio shoot day. Five people maximum" },
                { day: "Wednesday & Thursday", what: "Workshops" },
                { day: "Friday", what: "Scouting and demo classes" },
                { day: "Saturday & Sunday", what: "Academy classes" },
              ],
            },
            { kind: "sub", text: "2. Every offering served a bigger purpose." },
            { kind: "para", text: "The workshop and portfolio brought people in. Freshers were introduced to the academy, while professionals were scouted for the agency." },
          ],
        },
      ],
      keyTakeaway: "We trained talent on one end and got them work on the other.",
      extraLinks: [
        { label: "Nexttt One (Homepage) →", url: "https://www.nextttone.com/" },
        { label: "Instagram (Academy) →", url: "https://www.instagram.com/nextttone.talent.academy/" },
        { label: "Instagram (Agency) →", url: "https://www.instagram.com/nexttt.one/" },
      ],
    },
  },
];
