import { NewsArticle, NewsCategory, TrendingTopic } from '../types/news';
import { subMinutes } from 'date-fns';

const sources = {
  World: ['Reuters', 'Associated Press', 'BBC News', 'Al Jazeera', 'CNN International'],
  Politics: ['Politico', 'The Hill', 'Washington Post', 'The Guardian', 'New York Times'],
  Business: ['Bloomberg', 'Financial Times', 'Wall Street Journal', 'CNBC', 'Forbes'],
  Technology: ['TechCrunch', 'Wired', 'The Verge', 'Ars Technica', 'ZDNet'],
  Science: ['Nature', 'Science Daily', 'Space.com', 'Scientific American', 'New Scientist'],
  Health: ['WebMD', 'Medical News Today', 'WHO News', 'CDC Updates', 'Health Line'],
  Sports: ['ESPN', 'Sports Illustrated', 'Sky Sports', 'BBC Sport', 'The Athletic'],
  Entertainment: ['Variety', 'Hollywood Reporter', 'Entertainment Weekly', 'Billboard', 'Rolling Stone'],
  Property: ['Realtor.com', 'Zillow', 'Property Wire', 'Real Estate News', 'Housing Wire'],
  Finance: ['MarketWatch', 'Reuters Finance', 'Financial Post', 'The Economist', 'Barron\'s'],
  Insurance: ['Insurance Journal', 'Insurance News', 'Risk & Insurance', 'Insurance Business', 'Insurance Times'],
  AI: ['AI News', 'MIT Technology Review', 'VentureBeat', 'AI Trends', 'Machine Learning Times'],
  Environment: ['National Geographic', 'Environmental News Network', 'GreenBiz', 'CleanTechnica', 'EcoWatch'],
  Education: ['Education Week', 'Chronicle of Higher Education', 'Inside Higher Ed', 'EdSurge', 'Times Higher Education'],
  Automotive: ['Motor Trend', 'Automotive News', 'Car and Driver', 'AutoWeek', 'Road & Track']
};

const domains = {
  'Reuters': 'https://www.reuters.com',
  'Associated Press': 'https://apnews.com',
  'BBC News': 'https://www.bbc.com/news',
  'Al Jazeera': 'https://www.aljazeera.com',
  'CNN International': 'https://www.cnn.com/world',
  'Politico': 'https://www.politico.com',
  'The Hill': 'https://thehill.com',
  'Washington Post': 'https://www.washingtonpost.com',
  'The Guardian': 'https://www.theguardian.com',
  'New York Times': 'https://www.nytimes.com',
  'Bloomberg': 'https://www.bloomberg.com',
  'Financial Times': 'https://www.ft.com',
  'Wall Street Journal': 'https://www.wsj.com',
  'CNBC': 'https://www.cnbc.com',
  'Forbes': 'https://www.forbes.com',
  'TechCrunch': 'https://techcrunch.com',
  'Wired': 'https://www.wired.com',
  'The Verge': 'https://www.theverge.com',
  'Ars Technica': 'https://arstechnica.com',
  'ZDNet': 'https://www.zdnet.com',
  'Nature': 'https://www.nature.com',
  'Science Daily': 'https://www.sciencedaily.com',
  'Space.com': 'https://www.space.com',
  'Scientific American': 'https://www.scientificamerican.com',
  'New Scientist': 'https://www.newscientist.com',
  'WebMD': 'https://www.webmd.com',
  'Medical News Today': 'https://www.medicalnewstoday.com',
  'WHO News': 'https://www.who.int/news',
  'CDC Updates': 'https://www.cdc.gov/media',
  'Health Line': 'https://www.healthline.com',
  'ESPN': 'https://www.espn.com',
  'Sports Illustrated': 'https://www.si.com',
  'Sky Sports': 'https://www.skysports.com',
  'BBC Sport': 'https://www.bbc.com/sport',
  'The Athletic': 'https://theathletic.com',
  'Variety': 'https://variety.com',
  'Hollywood Reporter': 'https://www.hollywoodreporter.com',
  'Entertainment Weekly': 'https://ew.com',
  'Billboard': 'https://www.billboard.com',
  'Rolling Stone': 'https://www.rollingstone.com',
  'Realtor.com': 'https://www.realtor.com',
  'Zillow': 'https://www.zillow.com',
  'Property Wire': 'https://www.propertywire.com',
  'Real Estate News': 'https://www.realestatenews.com',
  'Housing Wire': 'https://www.housingwire.com',
  'MarketWatch': 'https://www.marketwatch.com',
  'Reuters Finance': 'https://www.reuters.com/finance',
  'Financial Post': 'https://www.financialpost.com',
  'The Economist': 'https://www.economist.com',
  'Barron\'s': 'https://www.barrons.com',
  'Insurance Journal': 'https://www.insurancejournal.com',
  'Insurance News': 'https://www.insurancenews.com',
  'Risk & Insurance': 'https://riskandinsurance.com',
  'Insurance Business': 'https://www.insurancebusinessmag.com',
  'Insurance Times': 'https://www.insurancetimes.co.uk',
  'AI News': 'https://artificialintelligence-news.com',
  'MIT Technology Review': 'https://www.technologyreview.com',
  'VentureBeat': 'https://venturebeat.com',
  'AI Trends': 'https://www.aitrends.com',
  'Machine Learning Times': 'https://www.machinelearningtimes.com',
  'National Geographic': 'https://www.nationalgeographic.com',
  'Environmental News Network': 'https://www.enn.com',
  'GreenBiz': 'https://www.greenbiz.com',
  'CleanTechnica': 'https://cleantechnica.com',
  'EcoWatch': 'https://www.ecowatch.com',
  'Education Week': 'https://www.edweek.org',
  'Chronicle of Higher Education': 'https://www.chronicle.com',
  'Inside Higher Ed': 'https://www.insidehighered.com',
  'EdSurge': 'https://www.edsurge.com',
  'Times Higher Education': 'https://www.timeshighereducation.com',
  'Motor Trend': 'https://www.motortrend.com',
  'Automotive News': 'https://www.autonews.com',
  'Car and Driver': 'https://www.caranddriver.com',
  'AutoWeek': 'https://www.autoweek.com',
  'Road & Track': 'https://www.roadandtrack.com'
};

const headlines = {
  World: ['Global Summit', 'International Crisis', 'Diplomatic Relations', 'Peace Treaty', 'Cultural Exchange'],
  Politics: ['Election Results', 'Policy Change', 'Legislative Vote', 'Political Reform', 'Government Decision'],
  Business: ['Market Update', 'Corporate Merger', 'Economic Forecast', 'Trade Agreement', 'Business Innovation'],
  Technology: ['Tech Breakthrough', 'Product Launch', 'Digital Innovation', 'Cybersecurity Update', 'Tech Trends'],
  Science: ['Scientific Discovery', 'Research Findings', 'Space Exploration', 'Laboratory Success', 'Theoretical Advance'],
  Health: ['Medical Discovery', 'Health Guidelines', 'Wellness Study', 'Treatment Innovation', 'Healthcare Policy'],
  Sports: ['Championship Match', 'Tournament Results', 'Team Transfer', 'Athletic Achievement', 'Sports Analysis'],
  Entertainment: ['Movie Release', 'Celebrity News', 'Award Show', 'Music Launch', 'Entertainment Industry'],
  Property: ['Real Estate Trends', 'Property Market', 'Housing Development', 'Market Analysis', 'Investment Opportunity'],
  Finance: ['Market Analysis', 'Investment Trends', 'Banking Update', 'Financial Policy', 'Economic Indicators'],
  Insurance: ['Policy Update', 'Industry Trends', 'Coverage Changes', 'Risk Assessment', 'Insurance Innovation'],
  AI: ['AI Development', 'Machine Learning', 'Neural Networks', 'AI Ethics', 'Automation Progress'],
  Environment: ['Climate Action', 'Sustainability', 'Environmental Policy', 'Green Technology', 'Conservation Effort'],
  Education: ['Education Reform', 'Learning Innovation', 'Academic Research', 'Student Success', 'Teaching Methods'],
  Automotive: ['Vehicle Launch', 'Industry Innovation', 'Market Trends', 'Technology Integration', 'Performance Review']
};

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateMockArticles(count: number, category: NewsCategory): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const categorySources = sources[category];
  const categoryHeadlines = headlines[category];

  for (let i = 0; i < count; i++) {
    const source = categorySources[Math.floor(Math.random() * categorySources.length)];
    const headline = categoryHeadlines[Math.floor(Math.random() * categoryHeadlines.length)];
    const timeOffset = Math.floor(Math.random() * 180); // Random time within last 3 hours
    const title = `${headline} ${i + 1}: Latest Updates and Analysis`;
    const slug = generateSlug(title);
    const baseUrl = domains[source as keyof typeof domains];

    articles.push({
      url: `${baseUrl}/article/${category.toLowerCase()}/${slug}`,
      title,
      source,
      category,
      publishedAt: subMinutes(new Date(), timeOffset).toISOString(),
      tone: (Math.random() * 2 - 1), // Random sentiment between -1 and 1
      location: {
        country: ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France'][
          Math.floor(Math.random() * 7)
        ],
        lat: (Math.random() * 180) - 90,
        lng: (Math.random() * 360) - 180
      }
    });
  }

  return articles;
}