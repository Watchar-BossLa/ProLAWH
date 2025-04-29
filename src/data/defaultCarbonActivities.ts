
import { CarbonActivity } from '@/types/carbon';

export const defaultCarbonActivities: CarbonActivity[] = [
  { 
    name: "Car Travel", 
    category: "Transportation", 
    icon: "car", 
    impactPerUnit: 2.3, 
    unit: "km", 
    frequency: "weekly",
    value: 50,
    maxValue: 500
  },
  { 
    name: "Electricity Usage", 
    category: "Home", 
    icon: "home", 
    impactPerUnit: 0.5, 
    unit: "kWh", 
    frequency: "weekly",
    value: 100,
    maxValue: 300
  },
  { 
    name: "Meat Consumption", 
    category: "Food", 
    icon: "shopping-bag", 
    impactPerUnit: 6.0, 
    unit: "meals", 
    frequency: "weekly",
    value: 3,
    maxValue: 21
  },
  { 
    name: "Plant-Based Meals", 
    category: "Food", 
    icon: "leaf", 
    impactPerUnit: -1.5, 
    unit: "meals", 
    frequency: "weekly",
    value: 5,
    maxValue: 21
  },
  { 
    name: "Public Transit", 
    category: "Transportation", 
    icon: "bus", 
    impactPerUnit: -0.8, 
    unit: "trips", 
    frequency: "weekly",
    value: 3,
    maxValue: 20
  },
  { 
    name: "Renewable Energy", 
    category: "Home", 
    icon: "sun", 
    impactPerUnit: -1.2, 
    unit: "kWh", 
    frequency: "weekly",
    value: 20,
    maxValue: 200
  },
  { 
    name: "Recycling", 
    category: "Waste", 
    icon: "recycle", 
    impactPerUnit: -0.3, 
    unit: "kg", 
    frequency: "weekly",
    value: 2,
    maxValue: 20
  }
];
