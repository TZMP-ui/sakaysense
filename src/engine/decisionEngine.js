export function evaluateOption(option, weights) {
  const {
    inVehTime,
    waitTime,
    waitSD,
    crowd,
    failProb,
    headway,
    transfers,
    walkTime,
    extraFare,
    confidence,
  } = option;

  const { wTime, wComfort, wBudget, wRisk } = weights;

  // 1. Effective Time & Denied-Boarding Cost (Shelat et al., 2022)
  const deniedBoardingDelay = failProb * (headway + waitSD);
  const cTime = wTime * (inVehTime + 1.5 * waitTime + 0.8 * waitSD + deniedBoardingDelay);

  // 2. Crowding Discomfort Cost (Kapatsila et al., 2025)
  const cComfort = wComfort * (6 * crowd);

  // 3. Non-Integrated Transfer & Fare Burden (Mijares et al., 2016)
  const cTransfer = (wTime * 1.5 * walkTime) + (3 * transfers) + (wBudget * 0.4 * extraFare);

  // 4. Information Unreliability Penalty (Drabicki et al., 2020)
  const riskExposure = waitTime + waitSD + 0.5 * inVehTime;
  const cUncertainty = wRisk * (1 - confidence) * riskExposure;

  const totalScore = +(cTime + cComfort + cTransfer + cUncertainty).toFixed(2);
  const rawEta = inVehTime + waitTime + walkTime;

  return {
    ...option,
    rawEta,
    totalScore,
    confidenceLabel: confidence >= 0.8 ? "High" : confidence >= 0.55 ? "Moderate" : "Low",
    breakdown: {
      time: +cTime.toFixed(1),
      comfort: +cComfort.toFixed(1),
      transfer: +cTransfer.toFixed(1),
      uncertainty: +cUncertainty.toFixed(1),
    },
  };
}

export function rankOptions(options, weights) {
  const evaluated = options.map((opt) => evaluateOption(opt, weights));
  const sorted = [...evaluated].sort((a, b) => a.totalScore - b.totalScore);
  const fastestRaw = [...evaluated].sort((a, b) => a.rawEta - b.rawEta)[0];

  const winner = sorted[0];
  const runnerUp = sorted[1];

  let explanation = "";
  if (winner.id !== fastestRaw.id) {
    const deltas = [
      { key: "uncertainty", label: "low data reliability", diff: fastestRaw.breakdown.uncertainty - winner.breakdown.uncertainty },
      { key: "comfort", label: "heavy crowding discomfort", diff: fastestRaw.breakdown.comfort - winner.breakdown.comfort },
      { key: "transfer", label: "transfer and extra fare burden", diff: fastestRaw.breakdown.transfer - winner.breakdown.transfer },
      { key: "time", label: "waiting variance and denied-boarding risk", diff: fastestRaw.breakdown.time - winner.breakdown.time },
    ].sort((a, b) => b.diff - a.diff);

    const topReason = deltas[0];
    explanation = `Even though "${fastestRaw.label}" has a shorter ${fastestRaw.rawEta}-min raw ETA, ${topReason.label} adds +${topReason.diff.toFixed(1)} perceived minutes to it. Choosing "${winner.label}" lowers your total risk-adjusted cost by ${(fastestRaw.totalScore - winner.totalScore).toFixed(1)} PEM.`;
  } else {
    const margin = runnerUp ? (runnerUp.totalScore - winner.totalScore).toFixed(1) : "0";
    explanation = `"${winner.label}" leads on both raw ETA (${winner.rawEta} min) and lowest perceived cost, outperforming the next option by ${margin} PEM under your current profile.`;
  }

  return { ranked: sorted, winner, fastestRaw, explanation };
}
