import React from 'react';

export interface GreenSkillsListProps {
  skills: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    co2_reduction_potential: number;
    market_growth_rate: number;
    created_at: string;
    updated_at: string;
  }>;
}

export const GreenSkillsList: React.FC<GreenSkillsListProps> = ({ skills }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Green Skills List:</h2>
      {skills.length > 0 ? (
        <ul className="list-disc list-inside">
          {skills.map(skill => (
            <li key={skill.id} className="mb-2">
              <span className="font-medium">{skill.name}</span> - {skill.description}
              <p className="text-sm text-gray-500">Category: {skill.category}</p>
              <p className="text-sm text-gray-500">CO2 Reduction Potential: {skill.co2_reduction_potential}</p>
              <p className="text-sm text-gray-500">Market Growth Rate: {skill.market_growth_rate}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No green skills found.</p>
      )}
    </div>
  );
};
