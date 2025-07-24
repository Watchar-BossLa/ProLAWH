/**
 * Retrieval-Augmented Generation (RAG) Module for DSPy
 * Combines retrieval with generation for knowledge-enhanced responses
 */

import { DSPyBaseModule } from './DSPyBaseModule';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';
import { DSPyTrainingExample } from '../types';

interface RetrievedDocument {
  content: string;
  score: number;
  source: string;
  metadata?: Record<string, any>;
}

interface RAGResult {
  answer: string;
  sources: RetrievedDocument[];
  confidence: number;
  retrievalTime: number;
  generationTime: number;
  totalTokens?: number;
}

export class RAGModule extends DSPyBaseModule {
  private knowledgeBase: Map<string, string> = new Map();
  private vectorStore: Map<string, number[]> = new Map();
  private embeddings: Map<string, number[]> = new Map();

  constructor(llmAdapter: DSPyLLMAdapter) {
    const signature = {
      input_fields: {
        query: "string - The user's question or information need",
        context: "string - Additional context for the query",
        max_docs: "number - Maximum number of documents to retrieve (default: 5)"
      },
      output_fields: {
        answer: "string - Generated answer based on retrieved knowledge",
        confidence: "number - Confidence score in the answer (0-1)",
        reasoning: "string - Explanation of how the answer was derived"
      },
      instruction: `You are an expert at answering questions using retrieved knowledge.

Given a query and relevant documents, provide a comprehensive and accurate answer.

Guidelines:
1. Use information from the provided documents to support your answer
2. Cite specific sources when making claims
3. If the retrieved documents don't contain sufficient information, acknowledge this
4. Provide a confidence score based on the quality and relevance of available information
5. Explain your reasoning process

Format your response with clear citations and reasoning.`
    };

    super('rag_module', signature, llmAdapter, {
      temperature: 0.2,
      max_tokens: 800
    });

    this.initializeKnowledgeBase();
  }

  async generateWithRetrieval(
    query: string,
    context: string = '',
    maxDocs: number = 5
  ): Promise<RAGResult> {
    const startTime = Date.now();
    
    // Retrieve relevant documents
    const retrievalStart = Date.now();
    const retrievedDocs = await this.retrieveDocuments(query, maxDocs);
    const retrievalTime = Date.now() - retrievalStart;

    // Generate answer using retrieved context
    const generationStart = Date.now();
    const enrichedContext = this.formatRetrievedContext(retrievedDocs);
    
    const inputs = {
      query,
      context: context + '\n\nRetrieved Information:\n' + enrichedContext,
      max_docs: maxDocs
    };

    const result = await this.forward(inputs);
    const generationTime = Date.now() - generationStart;

    return {
      answer: result.answer || 'No answer generated',
      sources: retrievedDocs,
      confidence: parseFloat(result.confidence) || 0.5,
      retrievalTime,
      generationTime,
      totalTokens: this.estimateTokens(result.answer || '')
    };
  }

  async addDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    this.knowledgeBase.set(id, content);
    
    // Generate embeddings (mock implementation - use real embeddings in production)
    const embedding = await this.generateEmbedding(content);
    this.vectorStore.set(id, embedding);
  }

  async addDocuments(documents: Array<{id: string, content: string, metadata?: Record<string, any>}>): Promise<void> {
    for (const doc of documents) {
      await this.addDocument(doc.id, doc.content, doc.metadata);
    }
  }

  private async retrieveDocuments(query: string, maxDocs: number): Promise<RetrievedDocument[]> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Calculate similarities
    const similarities: Array<{id: string, score: number}> = [];
    
    for (const [docId, docEmbedding] of this.vectorStore.entries()) {
      const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
      similarities.push({ id: docId, score: similarity });
    }

    // Sort by similarity and take top results
    similarities.sort((a, b) => b.score - a.score);
    const topResults = similarities.slice(0, maxDocs);

    // Format retrieved documents
    return topResults.map(result => ({
      content: this.knowledgeBase.get(result.id) || '',
      score: result.score,
      source: result.id,
      metadata: {}
    }));
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding generation - replace with actual embedding service
    // In production, use OpenAI embeddings, Sentence Transformers, etc.
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    // Simple bag-of-words style embedding for demo
    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      embedding[hash % 384] += 1;
    });
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private formatRetrievedContext(docs: RetrievedDocument[]): string {
    return docs
      .map((doc, index) => 
        `[Source ${index + 1}] (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}\n`
      )
      .join('\n');
  }

  private estimateTokens(text: string): number {
    // Rough token estimation (1 token ≈ 0.75 words)
    return Math.ceil(text.split(/\s+/).length / 0.75);
  }

  private initializeKnowledgeBase(): void {
    // Initialize with some sample knowledge
    const sampleDocs = [
      {
        id: "ai_overview",
        content: "Artificial Intelligence (AI) is a broad field of computer science focused on creating systems capable of performing tasks that typically require human intelligence. This includes machine learning, natural language processing, computer vision, and robotics."
      },
      {
        id: "machine_learning",
        content: "Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It includes supervised learning, unsupervised learning, and reinforcement learning approaches."
      },
      {
        id: "neural_networks",
        content: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through weighted connections and activation functions."
      }
    ];

    sampleDocs.forEach(doc => {
      this.addDocument(doc.id, doc.content);
    });
  }

  generateTrainingExamples(): void {
    const examples: DSPyTrainingExample[] = [
      {
        inputs: {
          query: "What is machine learning and how does it relate to AI?",
          context: "",
          max_docs: 3
        },
        expected_outputs: {
          answer: "Machine Learning is a subset of Artificial Intelligence that enables computers to learn and improve from experience without being explicitly programmed. It relates to AI as one of its core methodologies, alongside natural language processing, computer vision, and robotics.",
          confidence: "0.9",
          reasoning: "The answer combines information from retrieved documents about AI and machine learning, providing a clear definition and relationship explanation."
        }
      }
    ];

    this.addExamples(examples);
  }

  // Knowledge base management
  getKnowledgeBaseSize(): number {
    return this.knowledgeBase.size;
  }

  clearKnowledgeBase(): void {
    this.knowledgeBase.clear();
    this.vectorStore.clear();
    this.embeddings.clear();
  }

  exportKnowledgeBase(): Array<{id: string, content: string}> {
    return Array.from(this.knowledgeBase.entries()).map(([id, content]) => ({
      id,
      content
    }));
  }
}