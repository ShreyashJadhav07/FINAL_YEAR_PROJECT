// "use client";

// import React, { useState, useRef, useEffect } from 'react';

// interface PredictionResult {
//   decision_tree_prediction: number;
//   random_forest_prediction: number;
// }

// export default function Home() {
//   const [formData, setFormData] = useState({
//     age: '',
//     male: '',
//     totChol: '',
//     sysBP: '',
//     BMI: '',
//     heartRate: '',
//     glucose: '',
//     cigsPerDay: '',
//   });

//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const resultRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (result && resultRef.current) {
//       resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [result]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

//     if (numericFields.includes(name)) {
//       // remove any minus signs to prevent negative values and trim spaces
//       const sanitized = value.replace(/-/g, '').trim();
//       setFormData(prev => ({ ...prev, [name]: sanitized }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     setError(null);
//   };

//   const validate = () => {
//     const required = ['age', 'male', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

//     const missing = required.filter(f => !formData[f as keyof typeof formData]);
//     const negatives = numericFields.filter(f => {
//       const v = formData[f as keyof typeof formData];
//       if (v === '' || v === null || v === undefined) return false;
//       const num = parseFloat(String(v));
//       return !isNaN(num) && num < 0;
//     });

//     return { missing, negatives };
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
//     const { missing, negatives } = validate();
//     if (missing.length) {
//       setError(`Please fill: ${missing.join(', ')}`);
//       return;
//     }

//     if (negatives.length) {
//       setError(`Please remove negative values from: ${negatives.join(', ')}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const body = {
//         age: parseFloat(formData.age),
//         male: parseInt(formData.male),
//         totChol: parseFloat(formData.totChol),
//         sysBP: parseFloat(formData.sysBP),
//         BMI: parseFloat(formData.BMI),
//         heartRate: parseFloat(formData.heartRate),
//         glucose: parseFloat(formData.glucose),
//         cigsPerDay: parseFloat(formData.cigsPerDay),
//       };

//       const res = await fetch('http://127.0.0.1:8000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error(res.statusText || 'Prediction failed');
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFinalRisk = (r: PredictionResult) => (r.random_forest_prediction === 1 || r.decision_tree_prediction === 1 ? 1 : 0);

//   const HeartIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
//     </svg>
//   );

//   const ShieldIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
//     </svg>
//   );

//   const WarningIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
//     </svg>
//   );

//   const finalRisk = result ? getFinalRisk(result) : null;
//   const isHighRisk = finalRisk === 1;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12">
//       <main className="max-w-6xl mx-auto px-6">
//         <header className="text-center mb-10">
//           <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-200/30 mx-auto w-fit">
//             <HeartIcon className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900">AI-Powered Heart Disease Risk Prediction</h1>
//           <p className="mt-2 text-slate-600">AI-assisted cardiovascular health assessment — fast, private, informative.</p>
//         </header>

//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//           <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-slate-200">
//             <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Health Metrics</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Age</div>
//                 <input name="age" type="number" min={0} max={120} value={formData.age} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="Years" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Gender</div>
//                 <select name="male" value={formData.male} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Gender</option>
//                   <option value="1">Male</option>
//                   <option value="0">Female</option>
//                 </select>
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Total Cholesterol <span className="text-xs text-slate-400">(mg/dL)</span></div>
//                 <input name="totChol" type="number" min={0} value={formData.totChol} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="200" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Systolic BP <span className="text-xs text-slate-400">(mmHg)</span></div>
//                 <input name="sysBP" type="number" min={0} value={formData.sysBP} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="120" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">BMI <span className="text-xs text-slate-400">(kg/m²)</span></div>
//                 <input name="BMI" type="number" min={0} step="0.1" value={formData.BMI} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="decimal" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="25.5" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Heart Rate <span className="text-xs text-slate-400">(bpm)</span></div>
//                 <input name="heartRate" type="number" min={0} value={formData.heartRate} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="72" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Glucose <span className="text-xs text-slate-400">(mg/dL)</span></div>
//                 <input name="glucose" type="number" min={0} value={formData.glucose} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="100" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Cigarettes / day</div>
//                 <input name="cigsPerDay" type="number" min={0} value={formData.cigsPerDay} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="0" />
//               </label>
//             </div>

//             {error && <div className="mt-4 text-red-700 bg-red-50 border border-red-100 p-3 rounded-md">{error}</div>}

//             <button disabled={loading} type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-60">
//               {loading ? (
//                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
//               ) : (
//                 <ShieldIcon className="w-5 h-5" />
//               )}
//               <span>{loading ? 'Analyzing…' : 'Analyze Risk'}</span>
//             </button>

//             <p className="mt-4 text-xs text-slate-500">Medical disclaimer: this is an informational tool and not a diagnosis.</p>
//           </form>

//           <aside className="space-y-6">
//             <div ref={resultRef} className={`rounded-2xl p-8 shadow-2xl border transition-all ${result ? (isHighRisk ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200') : 'bg-white/60 border-slate-200'}`}>
//               {!result ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600">
//                   <ShieldIcon className="w-10 h-10 text-slate-700 mb-4" />
//                   <p className="font-medium">Results will appear here</p>
//                   <p className="text-sm mt-2">Enter your data and click Analyze Risk to get an assessment.</p>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center p-4 rounded-full mx-auto mb-4 shadow-lg" style={{ background: isHighRisk ? '#F97373' : '#10B981' }}>
//                     {isHighRisk ? <WarningIcon className="w-8 h-8 text-white" /> : <ShieldIcon className="w-8 h-8 text-white" />}
//                   </div>

//                   <div className="mb-3">
//                     <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${isHighRisk ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
//                       {isHighRisk ? 'High Risk' : 'Low Risk'}
//                     </span>
//                   </div>

//                   <h3 className={`text-2xl font-semibold ${isHighRisk ? 'text-red-900' : 'text-emerald-900'}`}>{isHighRisk ? 'Potential Risk Detected' : 'No Immediate Risk'}</h3>
//                   <p className="mt-3 text-sm text-slate-600 max-w-prose mx-auto">
//                     {isHighRisk
//                       ? 'We recommend consulting a healthcare professional for a comprehensive evaluation and personalized guidance.'
//                       : 'Your cardiovascular risk appears low based on provided metrics. Maintain a healthy lifestyle.'}
//                   </p>

//                   {/* raw model output removed for cleaner UI */}
//                 </div>
//               )}
//             </div>

//             <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
//               <h4 className="font-semibold mb-2 text-slate-800">When to Seek Help</h4>
//               <p className="text-sm text-slate-700">Consult a professional for chest pain, fainting, shortness of breath, or sudden severe symptoms.</p>
//             </div>

//             <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
//               <h4 className="font-semibold mb-2 text-slate-800">About Accuracy</h4>
//               <p className="text-sm text-slate-700">This assessment uses trained models — treat it as informational, not diagnostic.</p>
//             </div>
//           </aside>
//         </section>
//       </main>
//     </div>
//   );
// }



// "use client";

// import React, { useState, useRef, useEffect } from 'react';

// interface PredictionResult {
//   decision_tree_prediction: number;
//   random_forest_prediction: number;
// }

// export default function Home() {
//   const [formData, setFormData] = useState({
//     age: '',
//     male: '',
//     totChol: '',
//     sysBP: '',
//     BMI: '',
//     heartRate: '',
//     glucose: '',
//     cigsPerDay: '',
//     had_covid: '',
//     covid_severity: '',
//     vaccinated: '',
//     oxygen_support: '',
//   });

//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const resultRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (result && resultRef.current) {
//       resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [result]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

//     if (numericFields.includes(name)) {
//       const sanitized = value.replace(/-/g, '').trim();
//       setFormData(prev => ({ ...prev, [name]: sanitized }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     setError(null);
//   };

//   const validate = () => {
//     const required = ['age', 'male', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay', 'had_covid', 'covid_severity', 'vaccinated', 'oxygen_support'];
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];

//     const missing = required.filter(f => !formData[f as keyof typeof formData]);
//     const negatives = numericFields.filter(f => {
//       const v = formData[f as keyof typeof formData];
//       if (v === '' || v === null || v === undefined) return false;
//       const num = parseFloat(String(v));
//       return !isNaN(num) && num < 0;
//     });

//     return { missing, negatives };
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
//     const { missing, negatives } = validate();
//     if (missing.length) {
//       setError(`Please fill: ${missing.join(', ')}`);
//       return;
//     }

//     if (negatives.length) {
//       setError(`Please remove negative values from: ${negatives.join(', ')}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       const body = {
//         age: parseFloat(formData.age),
//         male: parseInt(formData.male),
//         totChol: parseFloat(formData.totChol),
//         sysBP: parseFloat(formData.sysBP),
//         BMI: parseFloat(formData.BMI),
//         heartRate: parseFloat(formData.heartRate),
//         glucose: parseFloat(formData.glucose),
//         cigsPerDay: parseFloat(formData.cigsPerDay),
//         had_covid: parseInt(formData.had_covid),
//         covid_severity: parseInt(formData.covid_severity),
//         vaccinated: parseInt(formData.vaccinated),
//         oxygen_support: parseInt(formData.oxygen_support),
//       };

//       const res = await fetch('http://127.0.0.1:8000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error(res.statusText || 'Prediction failed');
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFinalRisk = (r: PredictionResult) => (r.random_forest_prediction === 1 || r.decision_tree_prediction === 1 ? 1 : 0);

//   const HeartIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
//     </svg>
//   );

//   const ShieldIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
//     </svg>
//   );

//   const WarningIcon = ({ className = '' }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
//     </svg>
//   );

//   const finalRisk = result ? getFinalRisk(result) : null;
//   const isHighRisk = finalRisk === 1;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12">
//       <main className="max-w-6xl mx-auto px-6">
//         <header className="text-center mb-10">
//           <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-200/30 mx-auto w-fit">
//             <HeartIcon className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-slate-900">AI-Powered Heart Disease Risk Prediction</h1>
//           <p className="mt-2 text-slate-600">AI-assisted cardiovascular health assessment — fast, private, informative.</p>
//         </header>

//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//           <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-slate-200">
//             <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Health Metrics</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Age</div>
//                 <input name="age" type="number" min={0} max={120} value={formData.age} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="Years" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Gender</div>
//                 <select name="male" value={formData.male} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Gender</option>
//                   <option value="1">Male</option>
//                   <option value="0">Female</option>
//                 </select>
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Total Cholesterol <span className="text-xs text-slate-400">(mg/dL)</span></div>
//                 <input name="totChol" type="number" min={0} value={formData.totChol} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="200" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Systolic BP <span className="text-xs text-slate-400">(mmHg)</span></div>
//                 <input name="sysBP" type="number" min={0} value={formData.sysBP} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="120" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">BMI <span className="text-xs text-slate-400">(kg/m²)</span></div>
//                 <input name="BMI" type="number" min={0} step="0.1" value={formData.BMI} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="decimal" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="25.5" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Heart Rate <span className="text-xs text-slate-400">(bpm)</span></div>
//                 <input name="heartRate" type="number" min={0} value={formData.heartRate} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="72" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Glucose <span className="text-xs text-slate-400">(mg/dL)</span></div>
//                 <input name="glucose" type="number" min={0} value={formData.glucose} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="100" />
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Cigarettes / day</div>
//                 <input name="cigsPerDay" type="number" min={0} value={formData.cigsPerDay} onChange={handleChange} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} inputMode="numeric" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900 placeholder-slate-400" placeholder="0" />
//               </label>

//               {/* COVID Related Fields */}
//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Had COVID?</div>
//                 <select name="had_covid" value={formData.had_covid} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Select</option>
//                   <option value="0">No</option>
//                   <option value="1">Yes</option>
//                 </select>
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">COVID Severity</div>
//                 <select name="covid_severity" value={formData.covid_severity} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Select</option>
//                   <option value="0">No COVID</option>
//                   <option value="1">Mild</option>
//                   <option value="2">Hospitalized</option>
//                   <option value="3">ICU</option>
//                 </select>
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Vaccinated?</div>
//                 <select name="vaccinated" value={formData.vaccinated} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Select</option>
//                   <option value="0">No</option>
//                   <option value="1">Yes</option>
//                 </select>
//               </label>

//               <label className="space-y-1 text-sm">
//                 <div className="font-medium text-slate-700">Needed Oxygen Support?</div>
//                 <select name="oxygen_support" value={formData.oxygen_support} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900">
//                   <option value="" disabled hidden>Select</option>
//                   <option value="0">No</option>
//                   <option value="1">Yes</option>
//                 </select>
//               </label>
//             </div>

//             {error && <div className="mt-4 text-red-700 bg-red-50 border border-red-100 p-3 rounded-md">{error}</div>}

//             <button disabled={loading} type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-60">
//               {loading ? (
//                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
//               ) : (
//                 <ShieldIcon className="w-5 h-5" />
//               )}
//               <span>{loading ? 'Analyzing…' : 'Analyze Risk'}</span>
//             </button>

//             <p className="mt-4 text-xs text-slate-500">Medical disclaimer: this is an informational tool and not a diagnosis.</p>
//           </form>

//           <aside className="space-y-6">
//             <div ref={resultRef} className={`rounded-2xl p-8 shadow-2xl border transition-all ${result ? (isHighRisk ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200') : 'bg-white/60 border-slate-200'}`}>
//               {!result ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center text-slate-600">
//                   <ShieldIcon className="w-10 h-10 text-slate-700 mb-4" />
//                   <p className="font-medium">Results will appear here</p>
//                   <p className="text-sm mt-2">Enter your data and click Analyze Risk to get an assessment.</p>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center p-4 rounded-full mx-auto mb-4 shadow-lg" style={{ background: isHighRisk ? '#F97373' : '#10B981' }}>
//                     {isHighRisk ? <WarningIcon className="w-8 h-8 text-white" /> : <ShieldIcon className="w-8 h-8 text-white" />}
//                   </div>

//                   <div className="mb-3">
//                     <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold ${isHighRisk ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
//                       {isHighRisk ? 'High Risk' : 'Low Risk'}
//                     </span>
//                   </div>

//                   <h3 className={`text-2xl font-semibold ${isHighRisk ? 'text-red-900' : 'text-emerald-900'}`}>{isHighRisk ? 'Potential Risk Detected' : 'No Immediate Risk'}</h3>
//                   <p className="mt-3 text-sm text-slate-600 max-w-prose mx-auto">
//                     {isHighRisk
//                       ? 'We recommend consulting a healthcare professional for a comprehensive evaluation and personalized guidance.'
//                       : 'Your cardiovascular risk appears low based on provided metrics. Maintain a healthy lifestyle.'}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
//               <h4 className="font-semibold mb-2 text-slate-800">When to Seek Help</h4>
//               <p className="text-sm text-slate-700">Consult a professional for chest pain, fainting, shortness of breath, or sudden severe symptoms.</p>
//             </div>

//             <div className="bg-white/80 rounded-2xl p-6 shadow-lg border border-slate-200">
//               <h4 className="font-semibold mb-2 text-slate-800">About Accuracy</h4>
//               <p className="text-sm text-slate-700">This assessment uses trained models — treat it as informational, not diagnostic.</p>
//             </div>
//           </aside>
//         </section>
//       </main>
//     </div>
//   );
// }
// "use client";

// import React, { useState, useRef, useEffect } from 'react';

// interface PredictionResult {
//   decision_tree_prediction: number;
//   random_forest_prediction: number;
// }

// export default function Home() {
//   const [formData, setFormData] = useState({
//     age: '',
//     male: '',
//     totChol: '',
//     sysBP: '',
//     BMI: '',
//     heartRate: '',
//     glucose: '',
//     cigsPerDay: '',
//     had_covid: '',
//     covid_severity: '',
//     vaccinated: '',
//     oxygen_support: '',
//   });

//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const resultRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (result && resultRef.current) {
//       resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [result]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];
//     if (numericFields.includes(name)) {
//       const sanitized = value.replace(/-/g, '').trim();
//       setFormData(prev => ({ ...prev, [name]: sanitized }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//     setError(null);
//   };

//   const validate = () => {
//     const required = ['age', 'male', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay', 'had_covid', 'covid_severity', 'vaccinated', 'oxygen_support'];
//     const numericFields = ['age', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay'];
//     const missing = required.filter(f => !formData[f as keyof typeof formData]);
//     const negatives = numericFields.filter(f => {
//       const v = formData[f as keyof typeof formData];
//       if (v === '' || v === null || v === undefined) return false;
//       const num = parseFloat(String(v));
//       return !isNaN(num) && num < 0;
//     });
//     return { missing, negatives };
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setResult(null);
//     const { missing, negatives } = validate();
//     if (missing.length) { setError(`Please fill in: ${missing.join(', ')}`); return; }
//     if (negatives.length) { setError(`Please remove negative values from: ${negatives.join(', ')}`); return; }
//     setLoading(true);
//     try {
//       const body = {
//         age: parseFloat(formData.age),
//         male: parseInt(formData.male),
//         totChol: parseFloat(formData.totChol),
//         sysBP: parseFloat(formData.sysBP),
//         BMI: parseFloat(formData.BMI),
//         heartRate: parseFloat(formData.heartRate),
//         glucose: parseFloat(formData.glucose),
//         cigsPerDay: parseFloat(formData.cigsPerDay),
//         had_covid: parseInt(formData.had_covid),
//         covid_severity: parseInt(formData.covid_severity),
//         vaccinated: parseInt(formData.vaccinated),
//         oxygen_support: parseInt(formData.oxygen_support),
//       };
//     const res = await fetch('https://final-year-project-kgn0.onrender.com/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) throw new Error(res.statusText || 'Prediction failed');
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFinalRisk = (r: PredictionResult) =>
//     r.random_forest_prediction === 1 || r.decision_tree_prediction === 1 ? 1 : 0;

//   const finalRisk = result ? getFinalRisk(result) : null;
//   const isHighRisk = finalRisk === 1;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         body {
//           font-family: 'DM Sans', sans-serif;
//           background: #f7f6f3;
//         }

//         .page-bg {
//           min-height: 100vh;
//           background: #f7f6f3;
//           background-image:
//             radial-gradient(ellipse 70% 50% at 10% 0%, rgba(254,202,202,0.3) 0%, transparent 55%),
//             radial-gradient(ellipse 60% 45% at 90% 100%, rgba(186,230,253,0.22) 0%, transparent 55%);
//           padding: 56px 20px 80px;
//         }

//         .serif { font-family: 'Instrument Serif', serif; }

//         .fade-in { animation: fadeIn 0.55s ease forwards; }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .pulse {
//           animation: pulse 2.6s ease-in-out infinite;
//         }
//         @keyframes pulse {
//           0%,100% { transform: scale(1);    opacity: .65; }
//           50%      { transform: scale(1.07); opacity: 1;   }
//         }

//         .layout {
//           max-width: 1160px;
//           margin: 0 auto;
//           display: grid;
//           grid-template-columns: 1fr 420px;
//           gap: 28px;
//           align-items: start;
//         }
//         @media (max-width: 900px) {
//           .layout { grid-template-columns: 1fr; }
//         }

//         .form-card {
//           background: rgba(255,255,255,0.92);
//           backdrop-filter: blur(14px);
//           border-radius: 28px;
//           border: 1px solid rgba(226,232,240,0.7);
//           box-shadow: 0 2px 40px rgba(0,0,0,0.06);
//           padding: 48px 44px;
//         }
//         @media (max-width: 600px) {
//           .form-card { padding: 28px 20px; border-radius: 22px; }
//         }

//         .divider {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           margin: 40px 0 30px;
//         }
//         .divider::before, .divider::after {
//           content: '';
//           flex: 1;
//           height: 1px;
//           background: #eaecf0;
//         }
//         .divider span {
//           font-family: 'Instrument Serif', serif;
//           font-style: italic;
//           font-size: 16px;
//           color: #b0bac8;
//           white-space: nowrap;
//         }

//         /* Key fix: more gap between fields */
//         .field-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 28px 28px;
//         }
//         @media (max-width: 520px) {
//           .field-grid { grid-template-columns: 1fr; gap: 22px; }
//         }

//         .field-label {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//         }
//         .label-text {
//           font-size: 10.5px;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           color: #7d8fa3;
//         }
//         .label-unit {
//           font-size: 10px;
//           font-weight: 400;
//           text-transform: none;
//           letter-spacing: 0;
//           color: #b8c4d0;
//           margin-left: 4px;
//         }

//         /* Taller, roomier inputs */
//         .field-input, .field-select {
//           width: 100%;
//           height: 54px;
//           padding: 0 20px;
//           border-radius: 14px;
//           border: 1.5px solid #e4e9f0;
//           background: #fdfcfb;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 15px;
//           color: #1e293b;
//           transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
//           outline: none;
//         }
//         .field-input::placeholder { color: #c2cad6; }
//         .field-input:hover  { border-color: #c8d2df; background: #fff; cursor: text; }
//         .field-select:hover { border-color: #c8d2df; background: #fff; cursor: pointer; }
//         .field-input:focus, .field-select:focus {
//           border-color: #e07070;
//           box-shadow: 0 0 0 4px rgba(220,38,38,0.09);
//           background: #fff;
//         }

//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
//         input[type=number] { -moz-appearance: textfield; }

//         .select-wrap { position: relative; }
//         .field-select { appearance: none; padding-right: 44px; }
//         .select-wrap::after {
//           content: '';
//           position: absolute;
//           right: 17px;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 0; height: 0;
//           border-left: 5px solid transparent;
//           border-right: 5px solid transparent;
//           border-top: 6px solid #a0aec0;
//           pointer-events: none;
//         }

//         .error-box {
//           margin-top: 24px;
//           padding: 16px 20px;
//           background: #fff1f2;
//           border: 1.5px solid #fecdd3;
//           border-radius: 14px;
//           color: #be123c;
//           font-size: 13.5px;
//           display: flex;
//           align-items: flex-start;
//           gap: 10px;
//           line-height: 1.55;
//         }

//         .submit-btn {
//           margin-top: 36px;
//           width: 100%;
//           height: 60px;
//           border-radius: 16px;
//           background: linear-gradient(135deg, #dc2626 0%, #be123c 100%);
//           color: white;
//           font-family: 'DM Sans', sans-serif;
//           font-weight: 600;
//           font-size: 16px;
//           letter-spacing: 0.015em;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           box-shadow: 0 6px 24px rgba(220,38,38,0.28);
//           position: relative;
//           overflow: hidden;
//           transition: transform 0.18s, box-shadow 0.18s;
//         }
//         .submit-btn::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
//           pointer-events: none;
//         }
//         .submit-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 32px rgba(220,38,38,0.36);
//         }
//         .submit-btn:active:not(:disabled) { transform: translateY(0); }
//         .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

//         .right-col { display: flex; flex-direction: column; gap: 20px; }

//         .result-card {
//           border-radius: 24px;
//           padding: 44px 32px;
//           text-align: center;
//           transition: all 0.4s ease;
//         }
//         .result-empty { background: white; border: 2px dashed #e8edf3; }
//         .result-high  { background: linear-gradient(150deg,#fff1f2,#ffe4e6); border: 1.5px solid #fecdd3; }
//         .result-low   { background: linear-gradient(150deg,#f0fdf4,#dcfce7); border: 1.5px solid #bbf7d0; }

//         .result-icon-ring {
//           width: 80px; height: 80px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 24px;
//         }
//         .ring-high { background: linear-gradient(135deg,#f43f5e,#dc2626); box-shadow: 0 10px 28px rgba(244,63,94,.3); }
//         .ring-low  { background: linear-gradient(135deg,#34d399,#059669); box-shadow: 0 10px 28px rgba(52,211,153,.3); }

//         .badge {
//           display: inline-flex;
//           align-items: center;
//           padding: 5px 16px;
//           border-radius: 999px;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.09em;
//           text-transform: uppercase;
//           margin-bottom: 14px;
//         }
//         .badge-high { background: #dc2626; color: white; }
//         .badge-low  { background: #059669; color: white; }

//         .model-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           margin-top: 26px;
//         }
//         .model-chip {
//           background: rgba(255,255,255,0.65);
//           border: 1px solid rgba(255,255,255,0.9);
//           border-radius: 14px;
//           padding: 16px 12px;
//         }
//         .model-chip-label {
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           color: #94a3b8;
//           margin-bottom: 6px;
//         }

//         .info-card {
//           background: white;
//           border: 1px solid #f0f4f8;
//           border-radius: 18px;
//           padding: 24px 26px;
//           box-shadow: 0 1px 10px rgba(0,0,0,0.04);
//         }
//         .info-card-title {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           font-size: 13.5px;
//           font-weight: 600;
//           color: #334155;
//           margin-bottom: 10px;
//         }
//         .info-icon {
//           width: 30px; height: 30px;
//           border-radius: 9px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }
//         .info-card p {
//           font-size: 13px;
//           color: #64748b;
//           line-height: 1.65;
//           padding-left: 40px;
//         }

//         .spin { animation: spin 0.9s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .header-pill {
//           display: inline-flex;
//           align-items: center;
//           gap: 7px;
//           background: #fff1f2;
//           border: 1px solid #fecdd3;
//           color: #be123c;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           padding: 6px 16px;
//           border-radius: 999px;
//           margin-bottom: 20px;
//         }
//       `}</style>

//       <div className="page-bg">
//         <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

//           {/* Header */}
//           <header style={{ textAlign: 'center', marginBottom: '52px' }}>
//             <div className="header-pill">
//               <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
//               AI-Powered Assessment
//             </div>
//            <h1 className="serif" style={{ fontSize: 'clamp(34px, 5vw, 54px)', color: '#0f172a', lineHeight: 1.12, fontWeight: 400 }}>
//   Evaluating Machine Learning Classifiers For Ranking<br />
//   <em style={{ color: '#dc2626' }}>
//     Post Vaccination Cardiovascular Risk
//   </em>
// </h1>
//             <p style={{ marginTop: '14px', color: '#64748b', fontSize: '15.5px', maxWidth: '420px', margin: '14px auto 0', lineHeight: 1.65 }}>
//               Enter your health metrics for an AI‑assisted cardiovascular risk assessment.
//             </p>
//           </header>

//           {/* Layout */}
//           <div className="layout">

//             {/* FORM */}
//             <form onSubmit={handleSubmit} className="form-card">
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
//                 <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>Health Metrics</h2>
//                 <span style={{ fontSize: '12px', color: '#a0adb8', fontWeight: 500 }}>All fields required</span>
//               </div>

//               {/* Core Vitals */}
//               <div className="divider"><span>Core Vitals</span></div>
//               <div className="field-grid">

//                 <div className="field-label">
//                   <span className="label-text">Age</span>
//                   <input name="age" type="number" min={0} max={120}
//                     value={formData.age} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="Years" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Gender</span>
//                   <div className="select-wrap">
//                     <select name="male" value={formData.male} onChange={handleChange} className="field-select">
//                       <option value="" disabled hidden>Select</option>
//                       <option value="1">Male</option>
//                       <option value="0">Female</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Total Cholesterol <span className="label-unit">mg/dL</span></span>
//                   <input name="totChol" type="number" min={0}
//                     value={formData.totChol} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="200" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Systolic BP <span className="label-unit">mmHg</span></span>
//                   <input name="sysBP" type="number" min={0}
//                     value={formData.sysBP} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="120" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">BMI <span className="label-unit">kg/m²</span></span>
//                   <input name="BMI" type="number" min={0} step="0.1"
//                     value={formData.BMI} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="decimal" className="field-input" placeholder="25.5" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Heart Rate <span className="label-unit">bpm</span></span>
//                   <input name="heartRate" type="number" min={0}
//                     value={formData.heartRate} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="72" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Glucose <span className="label-unit">mg/dL</span></span>
//                   <input name="glucose" type="number" min={0}
//                     value={formData.glucose} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="100" />
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Cigarettes / Day</span>
//                   <input name="cigsPerDay" type="number" min={0}
//                     value={formData.cigsPerDay} onChange={handleChange}
//                     onKeyDown={e => e.key === '-' && e.preventDefault()}
//                     inputMode="numeric" className="field-input" placeholder="0" />
//                 </div>

//               </div>

//               {/* COVID History */}
//               <div className="divider"><span>COVID History</span></div>
//               <div className="field-grid">

//                 <div className="field-label">
//                   <span className="label-text">Had COVID?</span>
//                   <div className="select-wrap">
//                     <select name="had_covid" value={formData.had_covid} onChange={handleChange} className="field-select">
//                       <option value="" disabled hidden>Select</option>
//                       <option value="0">No</option>
//                       <option value="1">Yes</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">COVID Severity</span>
//                   <div className="select-wrap">
//                     <select name="covid_severity" value={formData.covid_severity} onChange={handleChange} className="field-select">
//                       <option value="" disabled hidden>Select</option>
//                       <option value="0">No COVID</option>
//                       <option value="1">Mild</option>
//                       <option value="2">Hospitalized</option>
//                       <option value="3">ICU</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Vaccinated?</span>
//                   <div className="select-wrap">
//                     <select name="vaccinated" value={formData.vaccinated} onChange={handleChange} className="field-select">
//                       <option value="" disabled hidden>Select</option>
//                       <option value="0">No</option>
//                       <option value="1">Yes</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="field-label">
//                   <span className="label-text">Needed Oxygen Support?</span>
//                   <div className="select-wrap">
//                     <select name="oxygen_support" value={formData.oxygen_support} onChange={handleChange} className="field-select">
//                       <option value="" disabled hidden>Select</option>
//                       <option value="0">No</option>
//                       <option value="1">Yes</option>
//                     </select>
//                   </div>
//                 </div>

//               </div>

//               {error && (
//                 <div className="error-box">
//                   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
//                     <circle cx="12" cy="12" r="10"/>
//                     <line x1="12" y1="8" x2="12" y2="12"/>
//                     <line x1="12" y1="16" x2="12.01" y2="16"/>
//                   </svg>
//                   {error}
//                 </div>
//               )}

//               <button type="submit" disabled={loading} className="submit-btn">
//                 {loading ? (
//                   <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                     <circle cx="12" cy="12" r="10" strokeOpacity="0.22"/>
//                     <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
//                   </svg>
//                 ) : (
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
//                   </svg>
//                 )}
//                 {loading ? 'Analyzing…' : 'Analyze My Risk'}
//               </button>

//               <p style={{ marginTop: '14px', textAlign: 'center', fontSize: '12px', color: '#a0adb8', lineHeight: 1.5 }}>
//                 For informational use only — not a medical diagnosis.
//               </p>
//             </form>

//             {/* RIGHT COLUMN */}
//             <div className="right-col">

//               {/* Result card */}
//               <div
//                 ref={resultRef}
//                 className={`result-card ${!result ? 'result-empty' : isHighRisk ? 'result-high' : 'result-low'} ${result ? 'fade-in' : ''}`}
//               >
//                 {!result ? (
//                   <div style={{ padding: '32px 0', color: '#b0bac8' }}>
//                     <div className="pulse" style={{
//                       width: '76px', height: '76px', borderRadius: '50%',
//                       background: '#f8fafc', border: '2px dashed #dde3eb',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       margin: '0 auto 20px'
//                     }}>
//                       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8d2dc" strokeWidth="1.4">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
//                       </svg>
//                     </div>
//                     <p style={{ fontWeight: 600, fontSize: '16px', color: '#c8d2dc', marginBottom: '10px' }}>Awaiting Analysis</p>
//                     <p style={{ fontSize: '13.5px', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto' }}>
//                       Fill in your health metrics and click Analyze to see your cardiovascular risk assessment.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="fade-in">
//                     <div className={`result-icon-ring ${isHighRisk ? 'ring-high' : 'ring-low'}`}>
//                       {isHighRisk ? (
//                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
//                           <line x1="12" y1="9" x2="12" y2="13"/>
//                           <line x1="12" y1="17" x2="12.01" y2="17"/>
//                         </svg>
//                       ) : (
//                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//                           <polyline points="9 12 11 14 15 10"/>
//                         </svg>
//                       )}
//                     </div>

//                     <div className={`badge ${isHighRisk ? 'badge-high' : 'badge-low'}`}>
//                       {isHighRisk ? 'High Risk' : 'Low Risk'}
//                     </div>

//                     <h3 className="serif" style={{ fontSize: '28px', fontWeight: 400, color: isHighRisk ? '#9f1239' : '#14532d', marginBottom: '12px' }}>
//                       {isHighRisk ? 'Potential Risk Detected' : 'No Immediate Risk'}
//                     </h3>

//                     <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, maxWidth: '310px', margin: '0 auto' }}>
//                       {isHighRisk
//                         ? 'We recommend consulting a healthcare professional for a comprehensive evaluation and personalized guidance.'
//                         : 'Your cardiovascular risk appears low based on provided metrics. Continue maintaining a healthy lifestyle.'}
//                     </p>

//                     <div className="model-grid">
//                       {[
//                         { label: 'Decision Tree', val: result.decision_tree_prediction },
//                         { label: 'Random Forest', val: result.random_forest_prediction },
//                       ].map(({ label, val }) => (
//                         <div key={label} className="model-chip">
//                           <div className="model-chip-label">{label}</div>
//                           <div style={{ fontSize: '14px', fontWeight: 600, color: val === 1 ? '#dc2626' : '#059669' }}>
//                             {val === 1 ? '⚠ High Risk' : '✓ Low Risk'}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Info cards */}
//               <div className="info-card">
//                 <div className="info-card-title">
//                   <span className="info-icon" style={{ background: '#fff1f2' }}>
//                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
//                     </svg>
//                   </span>
//                   When to Seek Help
//                 </div>
//                 <p>Consult a professional immediately for chest pain, fainting, shortness of breath, or sudden severe symptoms.</p>
//               </div>

//               <div className="info-card">
//                 <div className="info-card-title">
//                   <span className="info-icon" style={{ background: '#eff6ff' }}>
//                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <circle cx="12" cy="12" r="10"/>
//                       <line x1="12" y1="16" x2="12" y2="12"/>
//                       <line x1="12" y1="8" x2="12.01" y2="8"/>
//                     </svg>
//                   </span>
//                   About Accuracy
//                 </div>
//                 <p>This tool uses trained ML models — treat results as informational guidance, not a clinical diagnosis.</p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


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
    had_covid: '',
    covid_severity: '',
    vaccinated: '',
    oxygen_support: '',
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
      const sanitized = value.replace(/-/g, '').trim();
      setFormData(prev => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const validate = () => {
    const required = ['age', 'male', 'totChol', 'sysBP', 'BMI', 'heartRate', 'glucose', 'cigsPerDay', 'had_covid', 'covid_severity', 'vaccinated', 'oxygen_support'];
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
    if (missing.length) { setError(`Please fill in: ${missing.join(', ')}`); return; }
    if (negatives.length) { setError(`Please remove negative values from: ${negatives.join(', ')}`); return; }
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
        had_covid: parseInt(formData.had_covid),
        covid_severity: parseInt(formData.covid_severity),
        vaccinated: parseInt(formData.vaccinated),
        oxygen_support: parseInt(formData.oxygen_support),
      };
    const res = await fetch('https://final-year-project-kgn0.onrender.com/predict', {
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

  const getFinalRisk = (r: PredictionResult) =>
    r.random_forest_prediction === 1 || r.decision_tree_prediction === 1 ? 1 : 0;

  const finalRisk = result ? getFinalRisk(result) : null;
  const isHighRisk = finalRisk === 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f7f6f3;
        }

        .page-bg {
          min-height: 100vh;
          background: #f7f6f3;
          background-image:
            radial-gradient(ellipse 70% 50% at 10% 0%, rgba(254,202,202,0.3) 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 90% 100%, rgba(186,230,253,0.22) 0%, transparent 55%);
          padding: 56px 20px 80px;
        }

        .serif { font-family: 'Instrument Serif', serif; }

        .fade-in { animation: fadeIn 0.55s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pulse {
          animation: pulse 2.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);    opacity: .65; }
          50%      { transform: scale(1.07); opacity: 1;   }
        }

        .layout {
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
        }

        .form-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          border-radius: 28px;
          border: 1px solid rgba(226,232,240,0.7);
          box-shadow: 0 2px 40px rgba(0,0,0,0.06);
          padding: 48px 44px;
        }
        @media (max-width: 600px) {
          .form-card { padding: 28px 20px; border-radius: 22px; }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 40px 0 30px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #eaecf0;
        }
        .divider span {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 16px;
          color: #b0bac8;
          white-space: nowrap;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px 28px;
        }
        @media (max-width: 520px) {
          .field-grid { grid-template-columns: 1fr; gap: 22px; }
        }

        .field-label {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .label-text {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a5568;
        }
        .label-unit {
          font-size: 10px;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: #718096;
          margin-left: 4px;
        }

        /* ── KEY FIX: darker placeholder + input text ── */
        .field-input, .field-select {
          width: 100%;
          height: 54px;
          padding: 0 20px;
          border-radius: 14px;
          border: 1.5px solid #d1d9e0;
          background: #fdfcfb;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1e293b;           /* typed value — dark */
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          outline: none;
        }
        /* Placeholder darker: was #c2cad6, now #8896a8 */
        .field-input::placeholder { color: #8896a8; }

        .field-input:hover  { border-color: #b0bec9; background: #fff; cursor: text; }
        .field-select:hover { border-color: #b0bec9; background: #fff; cursor: pointer; }
        .field-input:focus, .field-select:focus {
          border-color: #e07070;
          box-shadow: 0 0 0 4px rgba(220,38,38,0.09);
          background: #fff;
        }

        /* Darker default/unselected select text */
        .field-select {
          color: #1e293b;
        }
        /* Style the placeholder option to appear darker than before */
        .field-select option[value=""][disabled] {
          color: #8896a8;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }

        .select-wrap { position: relative; }
        .field-select { appearance: none; padding-right: 44px; }
        .select-wrap::after {
          content: '';
          position: absolute;
          right: 17px;
          top: 50%;
          transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #718096;
          pointer-events: none;
        }

        .error-box {
          margin-top: 24px;
          padding: 16px 20px;
          background: #fff1f2;
          border: 1.5px solid #fecdd3;
          border-radius: 14px;
          color: #be123c;
          font-size: 13.5px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.55;
        }

        .submit-btn {
          margin-top: 36px;
          width: 100%;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #dc2626 0%, #be123c 100%);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.015em;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 6px 24px rgba(220,38,38,0.28);
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(220,38,38,0.36);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .right-col { display: flex; flex-direction: column; gap: 20px; }

        .result-card {
          border-radius: 24px;
          padding: 44px 32px;
          text-align: center;
          transition: all 0.4s ease;
        }
        .result-empty { background: white; border: 2px dashed #e8edf3; }
        .result-high  { background: linear-gradient(150deg,#fff1f2,#ffe4e6); border: 1.5px solid #fecdd3; }
        .result-low   { background: linear-gradient(150deg,#f0fdf4,#dcfce7); border: 1.5px solid #bbf7d0; }

        .result-icon-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .ring-high { background: linear-gradient(135deg,#f43f5e,#dc2626); box-shadow: 0 10px 28px rgba(244,63,94,.3); }
        .ring-low  { background: linear-gradient(135deg,#34d399,#059669); box-shadow: 0 10px 28px rgba(52,211,153,.3); }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .badge-high { background: #dc2626; color: white; }
        .badge-low  { background: #059669; color: white; }

        .model-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 26px;
        }
        .model-chip {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 14px;
          padding: 16px 12px;
        }
        .model-chip-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 6px;
        }

        .info-card {
          background: white;
          border: 1px solid #f0f4f8;
          border-radius: 18px;
          padding: 24px 26px;
          box-shadow: 0 1px 10px rgba(0,0,0,0.04);
        }
        .info-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
        }
        .info-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-card p {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.65;
          padding-left: 40px;
        }

        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .header-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="page-bg">
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div className="header-pill">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
              AI-Powered Assessment
            </div>
           <h1 className="serif" style={{ fontSize: 'clamp(34px, 5vw, 54px)', color: '#0f172a', lineHeight: 1.12, fontWeight: 400 }}>
  Evaluating Machine Learning Classifiers For Ranking<br />
  <em style={{ color: '#dc2626' }}>
    Post Vaccination Cardiovascular Risk
  </em>
</h1>
            <p style={{ marginTop: '14px', color: '#64748b', fontSize: '15.5px', maxWidth: '420px', margin: '14px auto 0', lineHeight: 1.65 }}>
              Enter your health metrics for an AI‑assisted cardiovascular risk assessment.
            </p>
          </header>

          {/* Layout */}
          <div className="layout">

            {/* FORM */}
            <form onSubmit={handleSubmit} className="form-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>Health Metrics</h2>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>All fields required</span>
              </div>

              {/* Core Vitals */}
              <div className="divider"><span>Core Vitals</span></div>
              <div className="field-grid">

                <div className="field-label">
                  <span className="label-text">Age</span>
                  <input name="age" type="number" min={0} max={120}
                    value={formData.age} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="Years" />
                </div>

                <div className="field-label">
                  <span className="label-text">Gender</span>
                  <div className="select-wrap">
                    <select name="male" value={formData.male} onChange={handleChange} className="field-select"
                      style={{ color: formData.male === '' ? '#8896a8' : '#1e293b' }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                </div>

                <div className="field-label">
                  <span className="label-text">Total Cholesterol <span className="label-unit">mg/dL</span></span>
                  <input name="totChol" type="number" min={0}
                    value={formData.totChol} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="200" />
                </div>

                <div className="field-label">
                  <span className="label-text">Systolic BP <span className="label-unit">mmHg</span></span>
                  <input name="sysBP" type="number" min={0}
                    value={formData.sysBP} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="120" />
                </div>

                <div className="field-label">
                  <span className="label-text">BMI <span className="label-unit">kg/m²</span></span>
                  <input name="BMI" type="number" min={0} step="0.1"
                    value={formData.BMI} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="decimal" className="field-input" placeholder="25.5" />
                </div>

                <div className="field-label">
                  <span className="label-text">Heart Rate <span className="label-unit">bpm</span></span>
                  <input name="heartRate" type="number" min={0}
                    value={formData.heartRate} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="72" />
                </div>

                <div className="field-label">
                  <span className="label-text">Glucose <span className="label-unit">mg/dL</span></span>
                  <input name="glucose" type="number" min={0}
                    value={formData.glucose} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="100" />
                </div>

                <div className="field-label">
                  <span className="label-text">Cigarettes / Day</span>
                  <input name="cigsPerDay" type="number" min={0}
                    value={formData.cigsPerDay} onChange={handleChange}
                    onKeyDown={e => e.key === '-' && e.preventDefault()}
                    inputMode="numeric" className="field-input" placeholder="0" />
                </div>

              </div>

              {/* COVID History */}
              <div className="divider"><span>COVID History</span></div>
              <div className="field-grid">

                <div className="field-label">
                  <span className="label-text">Had COVID?</span>
                  <div className="select-wrap">
                    <select name="had_covid" value={formData.had_covid} onChange={handleChange} className="field-select"
                      style={{ color: formData.had_covid === '' ? '#8896a8' : '#1e293b' }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="field-label">
                  <span className="label-text">COVID Severity</span>
                  <div className="select-wrap">
                    <select name="covid_severity" value={formData.covid_severity} onChange={handleChange} className="field-select"
                      style={{ color: formData.covid_severity === '' ? '#8896a8' : '#1e293b' }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="0">No COVID</option>
                      <option value="1">Mild</option>
                      <option value="2">Hospitalized</option>
                      <option value="3">ICU</option>
                    </select>
                  </div>
                </div>

                <div className="field-label">
                  <span className="label-text">Vaccinated?</span>
                  <div className="select-wrap">
                    <select name="vaccinated" value={formData.vaccinated} onChange={handleChange} className="field-select"
                      style={{ color: formData.vaccinated === '' ? '#8896a8' : '#1e293b' }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="field-label">
                  <span className="label-text">Needed Oxygen Support?</span>
                  <div className="select-wrap">
                    <select name="oxygen_support" value={formData.oxygen_support} onChange={handleChange} className="field-select"
                      style={{ color: formData.oxygen_support === '' ? '#8896a8' : '#1e293b' }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>

              </div>

              {error && (
                <div className="error-box">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.22"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                  </svg>
                )}
                {loading ? 'Analyzing…' : 'Analyze My Risk'}
              </button>

              <p style={{ marginTop: '14px', textAlign: 'center', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                For informational use only — not a medical diagnosis.
              </p>
            </form>

            {/* RIGHT COLUMN */}
            <div className="right-col">

              {/* Result card */}
              <div
                ref={resultRef}
                className={`result-card ${!result ? 'result-empty' : isHighRisk ? 'result-high' : 'result-low'} ${result ? 'fade-in' : ''}`}
              >
                {!result ? (
                  <div style={{ padding: '32px 0', color: '#b0bac8' }}>
                    <div className="pulse" style={{
                      width: '76px', height: '76px', borderRadius: '50%',
                      background: '#f8fafc', border: '2px dashed #dde3eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8d2dc" strokeWidth="1.4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                      </svg>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '16px', color: '#c8d2dc', marginBottom: '10px' }}>Awaiting Analysis</p>
                    <p style={{ fontSize: '13.5px', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto' }}>
                      Fill in your health metrics and click Analyze to see your cardiovascular risk assessment.
                    </p>
                  </div>
                ) : (
                  <div className="fade-in">
                    <div className={`result-icon-ring ${isHighRisk ? 'ring-high' : 'ring-low'}`}>
                      {isHighRisk ? (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      ) : (
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <polyline points="9 12 11 14 15 10"/>
                        </svg>
                      )}
                    </div>

                    <div className={`badge ${isHighRisk ? 'badge-high' : 'badge-low'}`}>
                      {isHighRisk ? 'High Risk' : 'Low Risk'}
                    </div>

                    <h3 className="serif" style={{ fontSize: '28px', fontWeight: 400, color: isHighRisk ? '#9f1239' : '#14532d', marginBottom: '12px' }}>
                      {isHighRisk ? 'Potential Risk Detected' : 'No Immediate Risk'}
                    </h3>

                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, maxWidth: '310px', margin: '0 auto' }}>
                      {isHighRisk
                        ? 'We recommend consulting a healthcare professional for a comprehensive evaluation and personalized guidance.'
                        : 'Your cardiovascular risk appears low based on provided metrics. Continue maintaining a healthy lifestyle.'}
                    </p>

                    <div className="model-grid">
                      {[
                        { label: 'Decision Tree', val: result.decision_tree_prediction },
                        { label: 'Random Forest', val: result.random_forest_prediction },
                      ].map(({ label, val }) => (
                        <div key={label} className="model-chip">
                          <div className="model-chip-label">{label}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: val === 1 ? '#dc2626' : '#059669' }}>
                            {val === 1 ? '⚠ High Risk' : '✓ Low Risk'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info cards */}
              <div className="info-card">
                <div className="info-card-title">
                  <span className="info-icon" style={{ background: '#fff1f2' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </span>
                  When to Seek Help
                </div>
                <p>Consult a professional immediately for chest pain, fainting, shortness of breath, or sudden severe symptoms.</p>
              </div>

              <div className="info-card">
                <div className="info-card-title">
                  <span className="info-icon" style={{ background: '#eff6ff' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </span>
                  About Accuracy
                </div>
                <p>This tool uses trained ML models — treat results as informational guidance, not a clinical diagnosis.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}