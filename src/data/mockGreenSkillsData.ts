
export interface MockGreenSkill {
  id: string;
  name: string;
  description: string;
  co2_score: number; // 0-100 scale
  category: string;
  demand_level: "high" | "medium" | "low";
  sdg_alignment: string[];
}

export const mockGreenSkills: MockGreenSkill[] = [
  {
    id: "1",
    name: "Carbon Accounting",
    description: "Skills for measuring and reporting organizational carbon footprints",
    co2_score: 95,
    category: "Sustainability",
    demand_level: "high",
    sdg_alignment: ["13", "12"]
  },
  {
    id: "2",
    name: "Renewable Energy Systems",
    description: "Design and implementation of solar, wind, and other renewable energy technologies",
    co2_score: 90,
    category: "Energy",
    demand_level: "high",
    sdg_alignment: ["7", "13", "9"]
  },
  {
    id: "3",
    name: "Sustainable Supply Chain",
    description: "Optimizing supply chains to reduce environmental impact while maintaining efficiency",
    co2_score: 85,
    category: "Logistics",
    demand_level: "medium",
    sdg_alignment: ["12", "9", "8"]
  },
  {
    id: "4",
    name: "ESG Reporting",
    description: "Environmental, Social, and Governance reporting frameworks and methodologies",
    co2_score: 80,
    category: "Finance",
    demand_level: "high",
    sdg_alignment: ["12", "16"]
  },
  {
    id: "5",
    name: "Circular Economy Design",
    description: "Product and service design principles that eliminate waste and pollution",
    co2_score: 88,
    category: "Design",
    demand_level: "medium",
    sdg_alignment: ["12", "9", "11"]
  },
  {
    id: "6",
    name: "Sustainable Agriculture",
    description: "Farming practices that protect ecosystems and reduce resource use",
    co2_score: 92,
    category: "Agriculture",
    demand_level: "medium",
    sdg_alignment: ["2", "15", "6"]
  },
  {
    id: "7",
    name: "Green Building Design",
    description: "Architecture and construction techniques for energy efficient structures",
    co2_score: 86,
    category: "Architecture",
    demand_level: "high",
    sdg_alignment: ["11", "9", "7"]
  },
  {
    id: "8",
    name: "Climate Risk Analysis",
    description: "Assessment of climate change impacts on business operations and assets",
    co2_score: 83,
    category: "Finance",
    demand_level: "high",
    sdg_alignment: ["13", "11"]
  },
  {
    id: "9",
    name: "Water Conservation",
    description: "Technologies and strategies for reducing water consumption",
    co2_score: 78,
    category: "Water Management",
    demand_level: "medium",
    sdg_alignment: ["6", "14", "12"]
  },
  {
    id: "10",
    name: "Biodiversity Management",
    description: "Protecting and enhancing ecosystem services and natural habitats",
    co2_score: 87,
    category: "Conservation",
    demand_level: "medium",
    sdg_alignment: ["15", "14", "13"]
  },
  {
    id: "11",
    name: "Sustainable Finance",
    description: "Green bonds, impact investing and sustainable financial instruments",
    co2_score: 75,
    category: "Finance",
    demand_level: "high",
    sdg_alignment: ["8", "10", "17"]
  },
  {
    id: "12",
    name: "Carbon Capture Technology",
    description: "Engineering solutions for capturing and sequestering carbon emissions",
    co2_score: 89,
    category: "Engineering",
    demand_level: "high",
    sdg_alignment: ["13", "9"]
  },
  {
    id: "13",
    name: "Electric Vehicle Infrastructure",
    description: "Planning and deployment of EV charging networks",
    co2_score: 84,
    category: "Transport",
    demand_level: "high",
    sdg_alignment: ["11", "7", "9"]
  },
  {
    id: "14",
    name: "Waste Reduction Strategies",
    description: "Systems for minimizing waste production and increasing recycling rates",
    co2_score: 81,
    category: "Waste Management",
    demand_level: "medium",
    sdg_alignment: ["12", "11", "3"]
  },
  {
    id: "15",
    name: "Environmental Impact Assessment",
    description: "Methods to evaluate the environmental effects of proposed projects",
    co2_score: 76,
    category: "Sustainability",
    demand_level: "medium",
    sdg_alignment: ["15", "11", "13"]
  }
];
