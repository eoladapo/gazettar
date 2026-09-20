// Dummy content based on HTML mockups for initial page load
export const dummyAuthors = {
  amara: {
    name: "Amara Chukwu",
    initial: "A",
    bio: "Covering national politics and policy for Gazettar.",
  },
  tomi: {
    name: "Tomi Adeyemi",
    initial: "T",
    bio: "Reporting on technology and infrastructure for Gazettar.",
  },
  femi: {
    name: "Femi Bello",
    initial: "F",
    bio: "Writing about entertainment and culture for Gazettar.",
  },
  chidi: {
    name: "Chidi Okafor",
    initial: "C",
    bio: "Covering politics, technology and policy for Gazettar.",
  },
};

export const dummyPoliticsPosts = [
  {
    _id: "dummy-politics-1",
    title: "Inside the reshuffle: what the new cabinet signals for the next election",
    slug: { current: "cabinet-reshuffle-election-signals" },
    excerpt: "Three appointments stand out — and they tell you more about the coalition's next eighteen months than any speech did.",
    category: { title: "Politics", slug: { current: "politics" } },
    author: dummyAuthors.amara,
    readTime: 9,
    publishedAt: "2026-09-14",
    featured: true,
  },
  {
    _id: "dummy-politics-2",
    title: "The opposition's new strategy is quieter than anyone expected",
    slug: { current: "opposition-quiet-strategy" },
    excerpt: "No rallies, no viral clips — just a ground campaign built on data the ruling party didn't see coming.",
    category: { title: "Politics", slug: { current: "politics" } },
    author: dummyAuthors.amara,
    readTime: 7,
    publishedAt: "2026-09-13",
  },
  {
    _id: "dummy-politics-3",
    title: "What the new data protection bill actually changes",
    slug: { current: "data-protection-bill-changes" },
    excerpt: "A clause-by-clause read of the legislation moving through committee this month.",
    category: { title: "Politics", slug: { current: "politics" } },
    author: dummyAuthors.chidi,
    readTime: 8,
    publishedAt: "2026-09-12",
  },
  {
    _id: "dummy-politics-4",
    title: "The governors quietly positioning for 2028",
    slug: { current: "governors-positioning-2028" },
    excerpt: "Reading the early signals — the budgets, the appointments, the out-of-state trips — three years out.",
    category: { title: "Politics", slug: { current: "politics" } },
    author: dummyAuthors.amara,
    readTime: 10,
    publishedAt: "2026-09-11",
  },
];

export const dummyTechnologyPosts = [
  {
    _id: "dummy-tech-1",
    title: "The app that's quietly replacing cash at every market stall",
    slug: { current: "payments-app-market-stalls" },
    excerpt: "How a two-year-old payments startup became infrastructure without anyone officially deciding it should.",
    category: { title: "Technology", slug: { current: "technology" } },
    author: dummyAuthors.tomi,
    readTime: 7,
    publishedAt: "2026-09-13",
    featured: true,
  },
  {
    _id: "dummy-tech-2",
    title: "Why the new telecoms tariff hike is bigger than it looks",
    slug: { current: "telecoms-tariff-hike" },
    excerpt: "A breakdown of who actually absorbs the cost, and what it means for the next wave of app-based startups.",
    category: { title: "Technology", slug: { current: "technology" } },
    author: dummyAuthors.tomi,
    readTime: 7,
    publishedAt: "2026-09-12",
  },
  {
    _id: "dummy-tech-3",
    title: "Inside the AI startup scaling with almost no local investment",
    slug: { current: "ai-startup-scaling" },
    excerpt: "How the founders built a paying customer base before they raised a single naira.",
    category: { title: "Technology", slug: { current: "technology" } },
    author: dummyAuthors.tomi,
    readTime: 9,
    publishedAt: "2026-09-11",
  },
];

export const dummyEntertainmentPosts = [
  {
    _id: "dummy-ent-1",
    title: "The Afrobeats album everyone's arguing about this week",
    slug: { current: "afrobeats-album-debate" },
    excerpt: "Critics are split down the middle — and the split says more about the genre's future than the record itself.",
    category: { title: "Entertainment", slug: { current: "entertainment" } },
    author: dummyAuthors.femi,
    readTime: 6,
    publishedAt: "2026-09-12",
    featured: true,
  },
  {
    _id: "dummy-ent-2",
    title: "Streaming numbers now decide who gets a second season",
    slug: { current: "streaming-numbers-renewals" },
    excerpt: "Inside the algorithm-driven renewal decisions studios won't talk about on the record.",
    category: { title: "Entertainment", slug: { current: "entertainment" } },
    author: dummyAuthors.femi,
    readTime: 6,
    publishedAt: "2026-09-11",
  },
  {
    _id: "dummy-ent-3",
    title: "How a Lagos film crew shot a feature on a phone and a budget",
    slug: { current: "lagos-film-phone-budget" },
    excerpt: "The production choices behind the festival breakout nobody expected to travel this far.",
    category: { title: "Entertainment", slug: { current: "entertainment" } },
    author: dummyAuthors.chidi,
    readTime: 8,
    publishedAt: "2026-09-10",
  },
];

export const dummyAllPosts = [
  ...dummyPoliticsPosts,
  ...dummyTechnologyPosts,
  ...dummyEntertainmentPosts,
];

// Helper to merge Sanity posts with dummy content
export function mergeDummyWithSanity<T>(sanityData: T[], dummyData: T[]): T[] {
  if (sanityData && sanityData.length > 0) {
    return sanityData;
  }
  return dummyData;
}

// Get featured post (first politics post by default)
export function getDummyFeaturedPost() {
  return dummyPoliticsPosts[0];
}
