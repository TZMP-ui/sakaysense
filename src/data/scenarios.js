export const PROFILES = {
  urgent: {
    id: "urgent",
    name: "Late for Class / Work",
    description: "Prioritizes speed and predictability; tolerates crowding.",
    weights: { wTime: 1.5, wComfort: 0.5, wBudget: 0.5, wRisk: 1.4 },
  },
  comfort: {
    id: "comfort",
    name: "Comfort / No Rush",
    description: "Willing to wait for a seat; strongly avoids packed rides.",
    weights: { wTime: 0.7, wComfort: 3.0, wBudget: 0.8, wRisk: 0.5 },
  },
  budget: {
    id: "budget",
    name: "Budget Student",
    description: "Avoids extra non-integrated transfer fares when possible.",
    weights: { wTime: 1.0, wComfort: 0.8, wBudget: 2.2, wRisk: 1.0 },
  },
};

export const SCENARIOS = [
  {
    id: "phantom-jeep",
    title: "Case 1: The Phantom Vehicle Trap",
    subtitle: "Crowded traditional jeep here now vs. unverified modern jeep estimate",
    options: [
      {
        id: "A",
        label: "Board Crowded Jeep Now",
        inVehTime: 30, waitTime: 0, waitSD: 0, crowd: 0.9,
        failProb: 0.25, headway: 10, transfers: 0, walkTime: 0,
        extraFare: 0, confidence: 0.9,
      },
      {
        id: "B",
        label: "Wait for Modern Jeep",
        inVehTime: 20, waitTime: 5, waitSD: 6, crowd: 0.3,
        failProb: 0.05, headway: 10, transfers: 0, walkTime: 0,
        extraFare: 3, confidence: 0.4,
      },
      {
        id: "C",
        label: "Transfer via Secondary Route",
        inVehTime: 20, waitTime: 3, waitSD: 2, crowd: 0.4,
        failProb: 0.05, headway: 6, transfers: 1, walkTime: 4,
        extraFare: 15, confidence: 0.8,
      },
    ],
  },
  {
    id: "mrt-denied",
    title: "Case 2: Peak MRT-3 Denied Boarding",
    subtitle: "Packed rail platform vs. walking to EDSA Carousel Busway",
    options: [
      {
        id: "A",
        label: "Queue for Packed MRT-3",
        inVehTime: 15, waitTime: 6, waitSD: 5, crowd: 1.0,
        failProb: 0.8, headway: 10, transfers: 0, walkTime: 0,
        extraFare: 0, confidence: 0.75,
      },
      {
        id: "B",
        label: "Switch to EDSA Carousel",
        inVehTime: 20, waitTime: 2, waitSD: 2, crowd: 0.5,
        failProb: 0.1, headway: 5, transfers: 1, walkTime: 4,
        extraFare: 15, confidence: 0.85,
      },
    ],
  },
  {
    id: "fare-penalty",
    title: "Case 3: Non-Integrated Fare Penalty",
    subtitle: "Direct traditional jeep vs. faster 2-leg transfer with separate fare",
    options: [
      {
        id: "A",
        label: "Direct Traditional Jeep",
        inVehTime: 30, waitTime: 4, waitSD: 2, crowd: 0.6,
        failProb: 0.1, headway: 8, transfers: 0, walkTime: 0,
        extraFare: 0, confidence: 0.8,
      },
      {
        id: "B",
        label: "2-Leg Transfer (Modern + Bus)",
        inVehTime: 22, waitTime: 2, waitSD: 2, crowd: 0.4,
        failProb: 0.05, headway: 6, transfers: 1, walkTime: 3,
        extraFare: 17, confidence: 0.85,
      },
    ],
  },
];
