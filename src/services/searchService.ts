
import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';
import type { Opportunity } from '@/types/marketplace';

export interface SearchResult<T> {
  item: T;
  score?: number;
  matches?: readonly FuseResult<T>['matches'];
}

export interface SearchOptions {
  query: string;
  categories?: string[];
  skills?: string[];
  remote?: boolean;
  insured?: boolean;
  minGreenScore?: number;
  sortBy?: 'relevance' | 'date' | 'greenScore' | 'alphabetical';
}

export class AdvancedSearchService {
  private fuseOptions: IFuseOptions<Opportunity> = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'company', weight: 0.2 },
      { name: 'skills_required', weight: 0.1 }
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true
  };

  private searchHistory: string[] = [];
  private popularSearches = [
    'renewable energy',
    'sustainability',
    'ESG analysis',
    'green building',
    'carbon footprint',
    'circular economy'
  ];

  searchOpportunities(opportunities: Opportunity[], options: SearchOptions): SearchResult<Opportunity>[] {
    let results = opportunities;

    // Apply filters first
    results = this.applyFilters(results, options);

    // Apply fuzzy search if query exists
    if (options.query.trim()) {
      const fuse = new Fuse(results, this.fuseOptions);
      const searchResults = fuse.search(options.query);
      
      // Track search query
      this.addToSearchHistory(options.query);
      
      return searchResults.map(result => ({
        item: result.item,
        score: result.score,
        matches: result.matches
      }));
    }

    // Return all filtered results with relevance scoring
    return results.map(item => ({ item, score: this.calculateRelevanceScore(item) }));
  }

  private applyFilters(opportunities: Opportunity[], options: SearchOptions): Opportunity[] {
    return opportunities.filter(opp => {
      if (options.remote && !opp.is_remote) return false;
      if (options.insured && !opp.has_insurance) return false;
      if (options.minGreenScore && opp.green_score < options.minGreenScore) return false;
      
      if (options.skills?.length) {
        const hasMatchingSkill = options.skills.some(skill => 
          opp.skills_required.some(oppSkill => 
            oppSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }
      
      return true;
    });
  }

  private calculateRelevanceScore(opportunity: Opportunity): number {
    // Simple relevance scoring based on various factors
    let score = 0;
    
    // Green score weight
    score += opportunity.green_score * 0.3;
    
    // Remote work bonus
    if (opportunity.is_remote) score += 10;
    
    // Insurance bonus
    if (opportunity.has_insurance) score += 5;
    
    // Recent posting bonus (mock calculation)
    const daysSincePosted = Math.floor(Math.random() * 30);
    score += Math.max(0, 30 - daysSincePosted);
    
    return score / 100; // Normalize to 0-1 range
  }

  getSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    
    // Add recent searches that match
    const recentMatches = this.searchHistory
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
    
    suggestions.push(...recentMatches);
    
    // Add popular searches that match
    const popularMatches = this.popularSearches
      .filter(search => 
        search.toLowerCase().includes(query.toLowerCase()) &&
        !suggestions.includes(search)
      )
      .slice(0, 3);
    
    suggestions.push(...popularMatches);
    
    return suggestions.slice(0, 5);
  }

  getRecentSearches(): string[] {
    return this.searchHistory.slice(-5).reverse();
  }

  getPopularSearches(): string[] {
    return this.popularSearches.slice(0, 6);
  }

  private addToSearchHistory(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || this.searchHistory.includes(trimmedQuery)) return;
    
    this.searchHistory.push(trimmedQuery);
    
    // Keep only last 20 searches
    if (this.searchHistory.length > 20) {
      this.searchHistory = this.searchHistory.slice(-20);
    }
  }

  clearSearchHistory(): void {
    this.searchHistory = [];
  }
}

export const searchService = new AdvancedSearchService();
