"use client";

import React, { useState, useRef, useEffect } from 'react';

interface PredictionResult {
  decision_tree_prediction: number;
  random_forest_prediction: number;
}

export default function Home() {
  const [formData, setFormData] = useState({
    age: '',
    male: '',
    totChol: '',
    sysBP: '',
    BMI: '',
    heartRate: '',
    glucose: '',
    cigsPerDay: '',
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [result]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

    if (numericFields.includes(name)) {
      // remove any minus signs to prevent negative values and trim spaces
      const sanitized = value.replace(/-/g, '').trim();
      setFormData(prev => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    setError(null);
  };

  const validate = () => {
    const required = ['age', 'male', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];
    const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

    const missing = required.filter(f => !formData[f as keyof typeof formData]);
    const negatives = numericFields.filter(f => {
      const v = formData[f as keyof typeof formData];
      if (v === '' || v === null || v === undefined) return false;
      const num = parseFloat(String(v));
      return !isNaN(num) && num < 0;
    });

    return { missing, negatives };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const { missing, negatives } = validate();
    if (missing.length) {
      setError(`Please fill: ${missing.join(', ')}`);
      return;
    }

    if (negatives.length) {
      setError(`Please remove negative values from: ${negatives.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const body = {
        age: parseFloat(formData.age),
        male: parseInt(formData.male),
        totChol: parseFloat(formData.totChol),
        sysBP: parseFloat(formData.sysBP),
        BMI: parseFloat(formData.BMI),
        heartRate: parseFloat(formData.heartRate),
        glucose: parseFloat(formData.glucose),
        cigsPerDay: parseFloat(formData.cigsPerDay),
      };

      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(res.statusText || 'Prediction failed');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getFinalRisk = (r: PredictionResult) => (r.random_forest_prediction === 1 || r.decision_tree_prediction === 1 ? 1 : 0);

  const HeartIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );

  const ShieldIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );

  const WarningIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );

  const finalRisk = result ? getFinalRisk(result) : null;
  const isHighRisk = finalRisk === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12">
      <main className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-200/30 mx-auto w-fit">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900">AI-Powered Heart Disease Risk Prediction</h1>
          <p className="mt-2 text-slate-600">AI-assisted cardiovascular health assessment — fast, private, informative.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Health Metrics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Age</div>
                <input name="age" type="number" min={0} max={120} value={formData.age} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="Years" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Gender</div>
                <select name="male" value={formData.male} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
                  <option value="" disabled hidden>Gender</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Total Cholesterol <span className="text-xs text-slate-400">(mg/dL)</span></div>
                <input name="totChol" type="number" min={0} value={formData.totChol} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="200" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Systolic BP <span className="text-xs text-slate-400">(mmHg)</span></div>
                <input name="sysBP" type="number" min={0} value={formData.sysBP} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="120" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">BMI <span className="text-xs text-slate-400">(kg/m²)</span></div>
                <input name="BMI" type="number" min={0} step="0.1" value={formData.BMI} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="decimal" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="25.5" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Heart Rate <span className="text-xs text-slate-400">(bpm)</span></div>
                <input name="heartRate" type="number" min={0} value={formData.heartRate} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="72" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Glucose <span className="text-xs text-slate-400">(mg/dL)</span></div>
                <input name="glucose" type="number" min={0} value={formData.glucose} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="100" />
              </label>

              <label className="space-y-1 text-sm">
                <div className="font-medium text-slate-700">Cigarettes / day</div>
                <input name="cigsPerDay" type="number" min={0} value={formData.cigsPerDay} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="0" />
              </label>
            </div>

            {error && <div className="mt-4 text-red-700 bg-red-50 border border-red-100 p-3 rounded-md">{error}</div>}

            <button disabled={loading} type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-60">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
              ) : (
                <ShieldIcon className="w-5 h-5" />
              )}
              <span>{loading ? 'Analyzing…' : 'Analyze Risk'}</span>
            </button>

            <p className="mt-4 text-xs text-slate-500">Medical disclaimer: this is an informational tool and not a diagnosis.</p>
          </form>

          <aside className="space-y-6">
            <div ref={resultRef} className={`rounded-2xl p-8 shadow-2xl border transition-all ${result ? (isHighRisk ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200') : 'bg-white/60 border-slate-200'}`}>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600">
                  <ShieldIcon className="w-10 h-10 text-slate-700 mb-4" />
                  <p className="font-medium">Results will appear here</p>
                  <p className="text-sm mt-2">Enter your data and click Analyze Risk to get an assessment.</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 rounded-full mx-auto mb-4 shadow-lg" style={{ background: isHighRisk ? '#F97373' : '#10B981' }}>
                    {isHighRisk ? <WarningIcon className="w-8 h-8 text-white" /> : <ShieldIcon className="w-8 h-8 text-white" />}
                  </div>

                  <div className="mb-3">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${isHighRisk ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {isHighRisk ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-semibold ${isHighRisk ? 'text-red-900' : 'text-emerald-900'}`}>{isHighRisk ? 'Potential Risk Detected' : 'No Immediate Risk'}</h3>
                  <p className="mt-3 text-sm text-slate-600 max-w-prose mx-auto">
                    {isHighRisk
                      ? 'We recommend consulting a healthcare professional for a comprehensive evaluation and personalized guidance.'
                      : 'Your cardiovascular risk appears low based on provided metrics. Maintain a healthy lifestyle.'}
                  </p>

                  {/* raw model output removed for cleaner UI */}
                </div>
              )}
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="font-semibold mb-2 text-slate-800">When to Seek Help</h4>
              <p className="text-sm text-slate-700">Consult a professional for chest pain, fainting, shortness of breath, or sudden severe symptoms.</p>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="font-semibold mb-2 text-slate-800">About Accuracy</h4>
              <p className="text-sm text-slate-700">This assessment uses trained models — treat it as informational, not diagnostic.</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
