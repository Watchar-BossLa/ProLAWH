
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuantumSkillVector {
  id: string;
  skill_id: string;
  quantum_state: {
    amplitude: number;
    phase: number;
    entangled_skills: string[];
  };
  entanglement_weights: Record<string, number>;
  interference_patterns: Record<string, number>;
  coherence_score: number;
}

interface QuantumMatch {
  id: string;
  target_id: string;
  target_type: 'job' | 'project' | 'mentor' | 'peer';
  probability_amplitude: number;
  quantum_score: number;
  classical_score: number;
  superposition_state: {
    skill_overlaps: string[];
    quantum_advantages: string[];
    coherence_factors: Record<string, number>;
  };
  measurement_confidence: number;
  entanglement_factors: Record<string, number>;
}

interface SkillEntanglement {
  skill_a_id: string;
  skill_b_id: string;
  entanglement_strength: number;
  entanglement_type: 'complementary' | 'synergistic' | 'foundational' | 'emergent';
  correlation_matrix: Record<string, number>;
}

export function useQuantumMatching() {
  const [quantumVectors, setQuantumVectors] = useState<QuantumSkillVector[]>([]);
  const [matches, setMatches] = useState<QuantumMatch[]>([]);
  const [entanglements, setEntanglements] = useState<SkillEntanglement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Quantum state preparation - creates superposition of user skills
  const prepareQuantumState = async (userSkills: string[]) => {
    setIsLoading(true);
    try {
      // Calculate quantum amplitudes for each skill
      const vectors: QuantumSkillVector[] = [];
      
      for (const skillId of userSkills) {
        // Fetch existing entanglements for this skill
        const { data: entangledSkills } = await supabase
          .from('skill_entanglements')
          .select('*')
          .or(`skill_a_id.eq.${skillId},skill_b_id.eq.${skillId}`);

        // Calculate quantum state based on skill relationships
        const amplitude = Math.sqrt(1 / userSkills.length); // Normalized amplitude
        const phase = Math.random() * 2 * Math.PI; // Random phase for quantum coherence
        
        const entanglementWeights: Record<string, number> = {};
        const interferencePatterns: Record<string, number> = {};
        
        entangledSkills?.forEach(ent => {
          const otherSkillId = ent.skill_a_id === skillId ? ent.skill_b_id : ent.skill_a_id;
          entanglementWeights[otherSkillId] = ent.entanglement_strength;
          
          // Calculate interference patterns
          interferencePatterns[otherSkillId] = Math.cos(phase) * ent.entanglement_strength;
        });

        // Calculate coherence score based on skill relationships
        const coherenceScore = entangledSkills?.reduce((sum, ent) => 
          sum + ent.entanglement_strength, 0) || 0;

        vectors.push({
          id: `vector_${skillId}`,
          skill_id: skillId,
          quantum_state: {
            amplitude,
            phase,
            entangled_skills: entangledSkills?.map(ent => 
              ent.skill_a_id === skillId ? ent.skill_b_id : ent.skill_a_id) || []
          },
          entanglement_weights,
          interference_patterns,
          coherence_score: coherenceScore / (entangledSkills?.length || 1)
        });
      }

      setQuantumVectors(vectors);
      
      // Store quantum vectors in database for later use
      for (const vector of vectors) {
        await supabase
          .from('quantum_skill_vectors')
          .upsert({
            skill_id: vector.skill_id,
            quantum_state: vector.quantum_state,
            entanglement_weights: vector.entanglement_weights,
            interference_patterns: vector.interference_patterns,
            coherence_score: vector.coherence_score
          });
      }

      console.log('Quantum state prepared:', vectors);
      return vectors;
    } catch (error) {
      console.error('Error preparing quantum state:', error);
      toast({
        title: "Quantum State Error",
        description: "Failed to prepare quantum skill state",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quantum measurement - collapses superposition to find matches
  const performQuantumMeasurement = async (
    vectors: QuantumSkillVector[], 
    targetType: 'job' | 'project' | 'mentor' | 'peer',
    targetIds: string[]
  ) => {
    setIsLoading(true);
    try {
      const quantumMatches: QuantumMatch[] = [];

      for (const targetId of targetIds) {
        // Calculate quantum match probability
        let probabilityAmplitude = 0;
        let quantumScore = 0;
        let classicalScore = 0;
        const entanglementFactors: Record<string, number> = {};
        const skillOverlaps: string[] = [];
        const quantumAdvantages: string[] = [];
        const coherenceFactors: Record<string, number> = {};

        // Quantum interference calculation
        for (const vector of vectors) {
          const amplitude = vector.quantum_state.amplitude;
          const phase = vector.quantum_state.phase;
          
          // Quantum interference between user skills and target requirements
          const interference = amplitude * Math.cos(phase);
          probabilityAmplitude += interference;
          
          // Calculate entanglement advantages
          Object.entries(vector.entanglement_weights).forEach(([skillId, weight]) => {
            entanglementFactors[skillId] = (entanglementFactors[skillId] || 0) + weight;
            if (weight > 0.7) {
              quantumAdvantages.push(`High entanglement with ${skillId}`);
            }
          });

          // Coherence contribution to match quality
          coherenceFactors[vector.skill_id] = vector.coherence_score;
          quantumScore += vector.coherence_score * amplitude;
          
          // Classical score for comparison
          classicalScore += amplitude;
          
          skillOverlaps.push(vector.skill_id);
        }

        // Normalize probability amplitude
        probabilityAmplitude = Math.abs(probabilityAmplitude) / vectors.length;
        
        // Final quantum score with entanglement bonuses
        const entanglementBonus = Object.values(entanglementFactors).reduce((sum, val) => sum + val, 0) / Object.keys(entanglementFactors).length;
        quantumScore = (quantumScore + (entanglementBonus || 0)) / vectors.length;
        
        // Measurement confidence based on coherence
        const averageCoherence = Object.values(coherenceFactors).reduce((sum, val) => sum + val, 0) / Object.values(coherenceFactors).length;
        const measurementConfidence = Math.min(averageCoherence, 1.0);

        const match: QuantumMatch = {
          id: `match_${targetId}`,
          target_id: targetId,
          target_type: targetType,
          probability_amplitude: probabilityAmplitude,
          quantum_score: quantumScore,
          classical_score: classicalScore / vectors.length,
          superposition_state: {
            skill_overlaps: skillOverlaps,
            quantum_advantages: quantumAdvantages,
            coherence_factors: coherenceFactors
          },
          measurement_confidence: measurementConfidence,
          entanglement_factors: entanglementFactors
        };

        quantumMatches.push(match);

        // Store quantum match in database
        await supabase
          .from('quantum_matches')
          .upsert({
            target_id: targetId,
            target_type: targetType,
            probability_amplitude: probabilityAmplitude,
            quantum_score: quantumScore,
            classical_score: classicalScore / vectors.length,
            superposition_state: match.superposition_state,
            measurement_confidence: measurementConfidence,
            entanglement_factors: entanglementFactors
          });
      }

      // Sort by quantum score (highest first)
      quantumMatches.sort((a, b) => b.quantum_score - a.quantum_score);
      setMatches(quantumMatches);
      
      console.log('Quantum measurement complete:', quantumMatches);
      return quantumMatches;
    } catch (error) {
      console.error('Error performing quantum measurement:', error);
      toast({
        title: "Quantum Measurement Error",
        description: "Failed to perform quantum skill measurement",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Build skill entanglement network
  const buildEntanglementNetwork = async (skills: string[]) => {
    try {
      // Calculate entanglement strengths between skills
      const entanglements: SkillEntanglement[] = [];
      
      for (let i = 0; i < skills.length; i++) {
        for (let j = i + 1; j < skills.length; j++) {
          const skillA = skills[i];
          const skillB = skills[j];
          
          // Simulate entanglement calculation (in real implementation, this would use ML)
          const entanglementStrength = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
          const entanglementType = Math.random() > 0.5 ? 'synergistic' : 'complementary';
          
          const correlationMatrix = {
            'co_occurrence': Math.random(),
            'skill_similarity': Math.random(),
            'market_demand_correlation': Math.random()
          };

          const entanglement: SkillEntanglement = {
            skill_a_id: skillA,
            skill_b_id: skillB,
            entanglement_strength: entanglementStrength,
            entanglement_type: entanglementType as any,
            correlation_matrix: correlationMatrix
          };

          entanglements.push(entanglement);

          // Store in database
          await supabase
            .from('skill_entanglements')
            .upsert({
              skill_a_id: skillA,
              skill_b_id: skillB,
              entanglement_strength: entanglementStrength,
              entanglement_type: entanglementType,
              correlation_matrix: correlationMatrix,
              measurement_history: []
            });
        }
      }

      setEntanglements(entanglements);
      return entanglements;
    } catch (error) {
      console.error('Error building entanglement network:', error);
      toast({
        title: "Entanglement Network Error",
        description: "Failed to build skill entanglement network",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    quantumVectors,
    matches,
    entanglements,
    isLoading,
    prepareQuantumState,
    performQuantumMeasurement,
    buildEntanglementNetwork
  };
}
