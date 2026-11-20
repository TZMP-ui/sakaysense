import { useState, useMemo } from "react";
import {
  Compass,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Clock,
  Users,
  Coins,
  ArrowUpRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { PROFILES, SCENARIOS } from "./data/scenarios";
import { rankOptions } from "./engine/decisionEngine";
import Particles from "./components/Particles";

export default function App() {
  const [profileId, setProfileId] = useState("urgent");
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [options, setOptions] = useState(SCENARIOS[0].options);
  const [editingId, setEditingId] = useState(null);

  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const profile = PROFILES[profileId];

  const handleScenarioChange = (id) => {
    const next = SCENARIOS.find((s) => s.id === id);
    if (!next) return;
    setScenarioId(id);
    setOptions(next.options.map((o) => ({ ...o })));
    setEditingId(null);
  };

  const updateField = (optId, field, value) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === optId ? { ...opt, [field]: Number(value) } : opt))
    );
  };

  const { ranked, winner, fastestRaw, explanation } = useMemo(
    () => rankOptions(options, profile.weights),
    [options, profile]
  );

  const maxScore = Math.max(...ranked.map((r) => r.totalScore), 1);

  // Compute profile weight meter percentages for visual sliders
  const weightMeters = [
    { label: "Time Sensitivity", key: "wTime", val: profile.weights.wTime, max: 2.0, color: "bg-sky-500" },
    { label: "Crowd Aversion", key: "wComfort", val: profile.weights.wComfort, max: 3.5, color: "bg-purple-500" },
    { label: "Budget Concern", key: "wBudget", val: profile.weights.wBudget, max: 2.5, color: "bg-amber-500" },
    { label: "Risk Sensitivity", key: "wRisk", val: profile.weights.wRisk, max: 2.0, color: "bg-rose-500" },
  ];

  return (
    <div className="relative min-h-screen bg-[#080a0f] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased overflow-x-hidden">
      {/* Background Particles Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <Particles
          particleColors={["#38bdf8", "#f59e0b", "#10b981", "#94a3b8"]}
          particleCount={90}
          particleSpread={12}
          speed={0.07}
          particleBaseSize={80}
          sizeRandomness={0.9}
          glow={0.3}
          twinkle={0.25}
          moveParticlesOnHover={true}
          hoverEffect="parallax"
          hoverRadius={160}
          clickBurst={true}
          cameraDistance={22}
          opacity={0.35}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-6 sm:space-y-8">
        
        {/* Navigation & Telemetry Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1f2838]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#141b26] border border-[#263449] flex items-center justify-center shrink-0 text-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  SakaySense
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#14202e] border border-[#1e344d] text-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PEM v1.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Confidence-Aware Commuter Decision Engine • Metro Manila Transit
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Scenario Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <label htmlFor="scenario-select" className="sr-only">Select transit scenario</label>
              <select
                id="scenario-select"
                value={scenarioId}
                onChange={(e) => handleScenarioChange(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-[#111722] hover:bg-[#161f2e] border border-[#233146] focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-200 focus:outline-none transition cursor-pointer pr-9"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ArrowUpRight className="w-4 h-4 rotate-45" />
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => handleScenarioChange(scenarioId)}
              className="p-2.5 bg-[#111722] hover:bg-[#161f2e] border border-[#233146] rounded-lg text-slate-300 hover:text-white transition flex items-center justify-center shrink-0"
              title="Reset scenario parameters"
              aria-label="Reset scenario parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CONTEXT & PERSONA CONTROLS (4 Cols) ================= */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* Active Case Study Brief */}
            <section className="bg-[#0f141d] border border-[#202938] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Active Case Study
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {options.length} Routes Evaluated
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-display">
                {activeScenario.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed font-light">
                {activeScenario.subtitle}
              </p>
            </section>

            {/* Commuter Persona Deck */}
            <section className="bg-[#0f141d] border border-[#202938] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Commuter Persona
                  </h3>
                  <p className="text-xs text-slate-500">Select behavioral profile</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#17202d] text-slate-300 border border-[#253245]">
                  Active: {profile.name}
                </span>
              </div>

              {/* Persona Buttons */}
              <div className="space-y-2.5">
                {Object.values(PROFILES).map((p) => {
                  const isSelected = profileId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProfileId(p.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? "bg-[#14202e] border-sky-500/80 text-white shadow-sm"
                          : "bg-[#0b0e14] border-[#1d2635] hover:border-[#2a384d] text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                          {p.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {p.id === "urgent" && "⚡ Speed & Risk"}
                          {p.id === "comfort" && "💺 Low Crowding"}
                          {p.id === "budget" && "🪙 Low Fare"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-snug">
                        {p.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Persona Psychological Weights Telemetry */}
              <div className="pt-3 border-t border-[#1a2332] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Profile Weight Vectors</span>
                  <span className="font-mono text-[11px] text-slate-500">Subjective Cost Scale</span>
                </div>
                <div className="space-y-2">
                  {weightMeters.map((m) => (
                    <div key={m.key} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{m.label}</span>
                        <span className="font-mono text-slate-300 font-semibold">
                          {m.val.toFixed(1)}x
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0b0e14] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.color}`}
                          style={{ width: `${Math.min(100, (m.val / m.max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </aside>

          {/* ================= RIGHT COLUMN: OPERATIONAL BOARD (8 Cols) ================= */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Decision Verdict Hero Banner */}
            <section className="bg-[#0b1712] border border-emerald-600/50 rounded-2xl p-5 sm:p-6 transition relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Recommended Commuter Decision
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10241b] border border-emerald-700/40 text-emerald-300">
                      {winner.confidenceLabel} Data Confidence ({Math.round(winner.confidence * 100)}%)
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                    Option {winner.id}: {winner.label}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                    {explanation}
                  </p>
                </div>

                {/* Score Callout */}
                <div className="sm:self-center shrink-0 bg-[#0e1f18] border border-emerald-700/40 rounded-xl p-4 sm:text-right min-w-[140px]">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                    Perceived Cost
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-white tracking-tight">
                    {winner.totalScore}
                    <span className="text-xs font-normal text-emerald-400 ml-1">PEM</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-300/70 mt-1 flex sm:justify-end items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Raw ETA: {winner.rawEta} min
                  </div>
                </div>
              </div>

              {/* Rapid metric badges */}
              <div className="mt-5 pt-4 border-t border-emerald-900/40 flex flex-wrap gap-3 sm:gap-6 text-xs font-mono text-emerald-200/80">
                <span>⏱ In-Vehicle: <strong className="text-white">{winner.inVehTime}m</strong></span>
                <span>⌛ Wait: <strong className="text-white">{winner.waitTime}m (±{winner.waitSD}m)</strong></span>
                <span>👥 Crowding: <strong className="text-white">{Math.round(winner.crowd * 100)}%</strong></span>
                <span>⚠️ Fail Risk: <strong className="text-white">{Math.round(winner.failProb * 100)}%</strong></span>
                <span>🪙 Extra Fare: <strong className="text-white">₱{winner.extraFare}</strong></span>
              </div>
            </section>

            {/* Options Comparison Matrix */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Evaluated Route Options ({ranked.length})
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Sorted by Lowest PEM (Risk-Adjusted)
                </span>
              </div>

              {ranked.map((opt, idx) => {
                const isWinner = idx === 0;
                const isBaselineTrap = opt.id === fastestRaw.id && !isWinner;
                const isEditing = editingId === opt.id;

                return (
                  <article
                    key={opt.id}
                    className={`rounded-2xl border transition-all ${
                      isWinner
                        ? "bg-[#0e161c] border-emerald-500/60 shadow-sm"
                        : "bg-[#0e131b] border-[#1d2737] hover:border-[#2b3a50]"
                    }`}
                  >
                    <div className="p-4 sm:p-5">
                      {/* Card Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                isWinner
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-[#161f2c] text-slate-300 border border-[#233146]"
                              }`}
                            >
                              Rank #{idx + 1}
                            </span>
                            
                            <h4 className="font-semibold text-base sm:text-lg text-slate-100">
                              Option {opt.id} — {opt.label}
                            </h4>

                            {isWinner && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Recommended
                              </span>
                            )}

                            {isBaselineTrap && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <AlertTriangle className="w-3 h-3" /> Deceptive Baseline Trap (Fastest Raw ETA)
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              Raw ETA: <strong className="text-slate-200">{opt.rawEta} min</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              Crowd: <strong className="text-slate-200">{Math.round(opt.crowd * 100)}%</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-slate-500" />
                              Extra: <strong className="text-slate-200">₱{opt.extraFare}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              Reliability: <strong className="text-slate-200">{Math.round(opt.confidence * 100)}%</strong>
                            </span>
                          </div>
                        </div>

                        {/* Cost & Tuning Control */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a2332]">
                          <div className="text-left sm:text-right">
                            <div className="text-xl font-mono font-bold text-slate-100">
                              {opt.totalScore}
                              <span className="text-xs font-normal text-slate-400 ml-1">PEM</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {isWinner ? "Lowest Cost" : `+${(opt.totalScore - winner.totalScore).toFixed(1)} vs. winner`}
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingId(isEditing ? null : opt.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition ${
                              isEditing
                                ? "bg-sky-600/20 border-sky-500 text-sky-300"
                                : "bg-[#151c27] hover:bg-[#1a2433] border-[#253246] text-slate-300"
                            }`}
                            aria-expanded={isEditing}
                            aria-label={`Tune conditions for Option ${opt.id}`}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{isEditing ? "Close" : "Tune"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Segmented PEM Breakdown Bar */}
                      <div className="mt-4 pt-3 border-t border-[#1a2332] space-y-2">
                        <div className="w-full h-2.5 bg-[#080b10] rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${(opt.breakdown.time / maxScore) * 100}%` }}
                            className="bg-sky-500 transition-all duration-300"
                            title={`Time & Wait Delay: ${opt.breakdown.time} PEM`}
                          />
                          <div
                            style={{ width: `${(opt.breakdown.comfort / maxScore) * 100}%` }}
                            className="bg-purple-500 transition-all duration-300"
                            title={`Crowding Discomfort: ${opt.breakdown.comfort} PEM`}
                          />
                          <div
                            style={{ width: `${(opt.breakdown.transfer / maxScore) * 100}%` }}
                            className="bg-amber-500 transition-all duration-300"
                            title={`Transfer & Fare: ${opt.breakdown.transfer} PEM`}
                          />
                          <div
                            style={{ width: `${(opt.breakdown.uncertainty / maxScore) * 100}%` }}
                            className="bg-rose-500 transition-all duration-300"
                            title={`Data Uncertainty: ${opt.breakdown.uncertainty} PEM`}
                          />
                        </div>

                        {/* Legend items */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-sky-500 shrink-0" />
                            Time: <strong className="text-slate-200">{opt.breakdown.time}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-purple-500 shrink-0" />
                            Crowd: <strong className="text-slate-200">{opt.breakdown.comfort}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-amber-500 shrink-0" />
                            Fare/Walk: <strong className="text-slate-200">{opt.breakdown.transfer}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm bg-rose-500 shrink-0" />
                            Risk: <strong className="text-slate-200">{opt.breakdown.uncertainty}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Interactive Sliders Drawer */}
                      {isEditing && (
                        <div className="mt-4 pt-4 border-t border-[#1a2332] bg-[#090d13] rounded-xl p-4 space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-sky-400" />
                              Live Parameter Tuning • Option {opt.id}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              Updates PEM dynamically
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                            {/* Confidence Slider */}
                            <label className="space-y-1.5 block">
                              <div className="flex justify-between text-slate-300">
                                <span>Data Confidence</span>
                                <span className="font-bold text-rose-400">{Math.round(opt.confidence * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.05"
                                value={opt.confidence}
                                onChange={(e) => updateField(opt.id, "confidence", e.target.value)}
                                className="w-full accent-rose-500"
                              />
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Phantom</span>
                                <span>Verified</span>
                              </div>
                            </label>

                            {/* Crowding Slider */}
                            <label className="space-y-1.5 block">
                              <div className="flex justify-between text-slate-300">
                                <span>Crowd Factor</span>
                                <span className="font-bold text-purple-400">{Math.round(opt.crowd * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="1.0"
                                step="0.05"
                                value={opt.crowd}
                                onChange={(e) => updateField(opt.id, "crowd", e.target.value)}
                                className="w-full accent-purple-500"
                              />
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Empty</span>
                                <span>Crush</span>
                              </div>
                            </label>

                            {/* Denied Boarding Probability */}
                            <label className="space-y-1.5 block">
                              <div className="flex justify-between text-slate-300">
                                <span>Denied Board Risk</span>
                                <span className="font-bold text-sky-400">{Math.round(opt.failProb * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="0.95"
                                step="0.05"
                                value={opt.failProb}
                                onChange={(e) => updateField(opt.id, "failProb", e.target.value)}
                                className="w-full accent-sky-500"
                              />
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Guaranteed</span>
                                <span>High Turnaway</span>
                              </div>
                            </label>

                            {/* Extra Fare Burden */}
                            <label className="space-y-1.5 block">
                              <div className="flex justify-between text-slate-300">
                                <span>Extra Fare</span>
                                <span className="font-bold text-amber-400">₱{opt.extraFare}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                step="1"
                                value={opt.extraFare}
                                onChange={(e) => updateField(opt.id, "extraFare", e.target.value)}
                                className="w-full accent-amber-500"
                              />
                              <div className="flex justify-between text-[10px] text-slate-500">
                                <span>₱0</span>
                                <span>₱50 max</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Visual Trade-Off Comparison Matrix */}
            <section className="bg-[#0f141d] border border-[#202938] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Cost Composition Across All Routes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparing perceived cost vectors side-by-side
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Scale: 0 to {Math.ceil(maxScore)} PEM
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {ranked.map((opt) => (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-medium">
                        Option {opt.id}: {opt.label}
                      </span>
                      <span className="font-bold text-slate-200">
                        {opt.totalScore} PEM
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#080b10] rounded overflow-hidden flex">
                      <div
                        style={{ width: `${(opt.breakdown.time / maxScore) * 100}%` }}
                        className="bg-sky-500"
                        title={`Time: ${opt.breakdown.time}`}
                      />
                      <div
                        style={{ width: `${(opt.breakdown.comfort / maxScore) * 100}%` }}
                        className="bg-purple-500"
                        title={`Comfort: ${opt.breakdown.comfort}`}
                      />
                      <div
                        style={{ width: `${(opt.breakdown.transfer / maxScore) * 100}%` }}
                        className="bg-amber-500"
                        title={`Transfer: ${opt.breakdown.transfer}`}
                      />
                      <div
                        style={{ width: `${(opt.breakdown.uncertainty / maxScore) * 100}%` }}
                        className="bg-rose-500"
                        title={`Uncertainty: ${opt.breakdown.uncertainty}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-[#1a2332] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            SakaySense • Metro Manila Generalized Perceived Cost ($GC$) Algorithm
          </div>
          <div>
            Built with React, Vite, Tailwind CSS & React Bits Particles
          </div>
        </footer>
      </div>
    </div>
  );
}
