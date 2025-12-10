'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Check, Package, Leaf, Truck, Award, Droplet, Star } from 'lucide-react';

// --- Types ---

type InquiryForm = {
  company_name: string;
  product_name: string;
  variety: string;
  quantity_required: string;
  quantity_unit: string;
  incoterm: string;
  delivery_port: string;
  country: string;
  email: string;
  country_code: string;
  phone_number: string;
  query_text: string;
};

// --- Data ---

const VARIETIES_LEFT = [
  'Traditional Basmati Rice',
  'Traditional Raw Basmati',
  'Traditional Steam Basmati',
  'Traditional Sella Basmati',
  '1121 Basmati Rice',
  '1121 Raw Basmati',
  '1121 Steam Basmati',
  '1121 Golden Sella Basmati',
  '1121 White / Creamy Sella',
  '1509 Basmati Rice',
  '1509 Raw',
  '1509 Steam',
  '1509 Golden Sella',
  'Sugandha White Sella',
  'Sugandha Golden',
  'Sugandha Steam',
  '1718 Basmati Rice',
  '1718 Raw Basmati',
];

const VARIETIES_RIGHT = [
  '1718 Steam Basmati',
  '1718 Golden Sella',
  '1718 White Sella',
  '1401 Basmati Rice',
  '1401 Steam Basmati',
  '1401 Golden Sella',
  '1401 White Sella',
  'Pusa Basmati Rice',
  'Pusa Raw Basmati',
  'Pusa Steam Basmati',
  'Pusa Golden Sella',
  'PR-11/14 White Sella',
  'PR-11/14 Steam',
  'PR-11/14 Golden Sella',
  'Sharbati White Steam',
  'Sharbati White Sella',
  'Sharbati Golden Sella',
];

const CHARACTERISTICS = [
  'Long, slender grains',
  'Strong natural aroma',
  '2–2.5× elongation when cooked',
  'Non-sticky, fluffy texture',
  'Slightly nutty taste',
  'Minimal width swelling',
];

const SPECS = [
  { param: 'Moisture', std: '≤ 12–13%' },
  { param: 'Foreign Matter', std: '≤ 0.5% or NIL' },
  { param: 'Broken Grains', std: '≤ 2%' },
  { param: 'Chalkiness', std: '≤ 5%' },
  { param: 'Immature Grains', std: '≤ 1%' },
  { param: 'Black/Red Grains', std: '≤ 0.2%' },
  { param: 'Damaged/Discoloured', std: '≤ 1%' },
  { param: 'Avg Grain Length (Raw)', std: '≥ 8.4 mm' },
  { param: 'Avg Grain Length (Cooked)', std: '≥ 22 mm' },
  { param: 'Milling', std: 'Well-milled, double-polished' },
  { param: 'Cleanliness', std: '100% Sortex-clean' },
];

const LOAD_CAPACITY = [
  { container: '20 FT', pack: '25 kg', bags: '1000–1100', weight: '25 MT' },
  { container: '20 FT', pack: '40 kg', bags: '625', weight: '25 MT' },
  { container: '20 FT', pack: '10 kg', bags: '2400–2500', weight: '24–25 MT' },
  { container: '40 FT', pack: '25 kg', bags: '1000–1100', weight: '25-28 MT' },
  { container: '40 FT', pack: '1 kg', bags: '24000–26000', weight: '25–28 MT' },
  { container: '40 FT HC', pack: '5 kg', bags: '4800–5000', weight: '25–28 MT' },
  { container: '40 FT', pack: '2 kg', bags: '12000–13000', weight: '25–28 MT' },
];

const PACKAGING_SIZES = ['1 kg', '2 kg', '5 kg', '10 kg', '20 kg', '25 kg', '30 kg','40 kg','45 kg', '50 kg'];
const PACKAGING_TYPES = ['PP Woven', 'BOPP', 'Non-Woven', 'Jute', 'Vacuum', 'Zip-lock'];
const PACKAGING_FEATURES = ['Loop handle', 'Transparent window', 'Aroma valve', 'Resealable zipper', 'Tamper-proof seal'];

const CERTIFICATIONS = ['APEDA', 'FSSAI', 'ISO 22000','3rd Party Inspection','Phytosanitary Certificate','COO Certificate', 'HACCP'];

// --- Components ---

export default function BasmatiRicePage() {
  const [formData, setFormData] = useState<InquiryForm>({
    company_name: '',
    product_name: 'Basmati Rice',
    variety: '',
    quantity_required: '',
    quantity_unit: 'MTS',
    incoterm: 'FOB',
    delivery_port: '',
    country: '',
    email: '',
    country_code: '+91',
    phone_number: '',
    query_text: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof InquiryForm, string>>>({});

  const validate = () => {
    const errors: Partial<Record<keyof InquiryForm, string>> = {};
    if (!formData.company_name) errors.company_name = 'Company Name is required';
    if (!formData.product_name) errors.product_name = 'Product Name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.country_code) errors.country_code = 'Code required';
    if (!formData.phone_number) errors.phone_number = 'Phone required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('inquiry_form')
        .insert({
          company_name: formData.company_name,
          product_name: formData.product_name,
          variety: formData.variety,
          quantity_required: formData.quantity_required ? parseFloat(formData.quantity_required) : null,
          quantity_unit: formData.quantity_unit,
          incoterm: formData.incoterm,
          delivery_port: formData.delivery_port,
          country: formData.country,
          email: formData.email,
          country_code: formData.country_code,
          phone_number: formData.phone_number,
          query_text: formData.query_text,
          source_page: '/basmati-rice',
          meta: { client: 'frontend' },
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        });

      if (error) throw error;

      setStatus('success');
      setFormData(prev => ({ ...prev, company_name: '', variety: '', quantity_required: '', delivery_port: '', country: '', email: '', phone_number: '', query_text: '' }));
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit inquiry');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof InquiryForm]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">

      {/* 1. Hero Section */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Left: Image Gallery */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary))]">
              Basmati Rice – India’s Aromatic Heritage
            </h1>
            <p className="text-lg text-muted-foreground">
              Premium quality, extra-long grain aromatic rice exported globally from the heart of India.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                "https://sagobctjwpnpmpcxxyut.supabase.co/storage/v1/object/public/new-product-images/istockphoto-519309790-612x612.jpg",
                "https://sagobctjwpnpmpcxxyut.supabase.co/storage/v1/object/public/new-product-images/How-to-Cook-Basmati-Rice%20(1).jpg",
                "https://sagobctjwpnpmpcxxyut.supabase.co/storage/v1/object/public/new-product-images/india-pakistan-tensions-drive-up-basmati-rice-prices.webp",
                "https://sagobctjwpnpmpcxxyut.supabase.co/storage/v1/object/public/new-product-images/Basmati-Rice-1.jpg"
              ].map((src, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <img
                    src={src}
                    alt={`Basmati Rice View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="bg-background border border-border rounded-xl shadow-md p-6 space-y-4 animate-slide-in-right">
            <h2 className="text-xl font-semibold text-[hsl(var(--primary))]">Request a Quote</h2>

            {status === 'success' && (
              <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm animate-fade-in">
                Your enquiry has been submitted. Our team will contact you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name *</label>
                  <input required name="company_name" value={formData.company_name} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  {validationErrors.company_name && <p className="text-xs text-red-500 mt-1">{validationErrors.company_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
                  <input required name="product_name" value={formData.product_name} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Variety</label>
                  <select name="variety" value={formData.variety} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Variety</option>
                    {[...VARIETIES_LEFT, ...VARIETIES_RIGHT].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">Qty</label>
                    <input type="number" name="quantity_required" value={formData.quantity_required} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-foreground mb-1">Unit</label>
                    <select name="quantity_unit" value={formData.quantity_unit} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {["KGS", "MTS", "BAGS", "TONS"].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Incoterm</label>
                <div className="flex gap-4">
                  {["EXW", "FOB", "CIF"].map(term => (
                    <label key={term} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="incoterm" value={term} checked={formData.incoterm === term} onChange={handleChange} className="text-primary focus:ring-ring" />
                      {term}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Delivery Port</label>
                  <input name="delivery_port" value={formData.delivery_port} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  {validationErrors.email && <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>}
                </div>
                <div className="flex gap-2">
                  <div className="w-24">
                    <label className="block text-sm font-medium text-foreground mb-1">Code *</label>
                    <select name="country_code" value={formData.country_code} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {["+91", "+1", "+44", "+971", "+61", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">Phone *</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    {validationErrors.phone_number && <p className="text-xs text-red-500 mt-1">{validationErrors.phone_number}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <textarea rows={3} name="query_text" value={formData.query_text} onChange={handleChange} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <button disabled={status === 'submitting'} type="submit" className="w-full rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-2.5 font-medium hover:opacity-90 transition-opacity disabled:opacity-70">
                {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Varieties Section */}
      <section className="py-12 max-w-6xl mx-auto px-4 bg-muted/30">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Varieties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ul className="space-y-2">
            {VARIETIES_LEFT.map((v, i) => (
              <li key={i} className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {v}
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {VARIETIES_RIGHT.map((v, i) => (
              <li key={i} className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Key Characteristics & Specs */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Key Characteristics & Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          <div>
            <ul className="space-y-3">
              {CHARACTERISTICS.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3 border-b border-border">Parameter</th>
                  <th className="px-4 py-3 border-b border-border">Standard</th>
                </tr>
              </thead>
              <tbody>
                {SPECS.map((s, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2 border-b border-border font-medium">{s.param}</td>
                    <td className="px-4 py-2 border-b border-border">{s.std}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Grading */}
      <section className="py-12 max-w-6xl mx-auto px-4 bg-muted/30">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Grading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Grade A – Extra-long grain, strong aroma, premium</li>
            <li className="flex items-center gap-2"><Award className="w-5 h-5 text-primary/70" /> Grade B – Long grain, good aroma</li>
            <li className="flex items-center gap-2"><Award className="w-5 h-5 text-primary/40" /> Grade C – Mixed/broken, lower aroma</li>
          </ul>
          <ul className="space-y-3 list-disc pl-5">
            <li>Grain length</li>
            <li>Varietal purity</li>
            <li>Broken %</li>
            <li>Whiteness & polish</li>
          </ul>
        </div>
      </section>

      {/* 5. Processing Stages */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Processing Stages</h2>
        <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
          {['Harvesting', 'Drying', 'Cleaning & De-husking', 'Polishing', 'Grading', 'Sorting (Optical/Manual)', 'Packaging', 'Storage / Aging'].map((step, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <h3 className="text-lg font-medium">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Packaging */}
      <section className="py-12 max-w-6xl mx-auto px-4 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="h-64 md:h-96 rounded-xl shadow-md overflow-hidden bg-white">
            <img src="https://sagobctjwpnpmpcxxyut.supabase.co/storage/v1/object/public/founder-images/Graha%20Impex.png" alt="Rice Packaging" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">Size Options</h3>
              <div className="flex flex-wrap gap-2">
                {PACKAGING_SIZES.map(s => <span key={s} className="px-3 py-1 bg-background border border-border rounded-full text-sm">{s}</span>)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">Packaging Types</h3>
              <div className="flex flex-wrap gap-2">
                {PACKAGING_TYPES.map(t => <span key={t} className="px-3 py-1 bg-background border border-border rounded-full text-sm">{t}</span>)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {PACKAGING_FEATURES.map(f => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> {f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Certifications */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Certifications</h2>
        <div className="flex flex-wrap gap-6 items-center">
          {CERTIFICATIONS.map(c => (
            <div key={c} className="flex items-center gap-3 px-6 py-4 bg-background border border-border rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Container Load Capacity */}
      <section className="py-12 max-w-6xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-semibold text-[hsl(var(--primary))] mb-6">Container Load Capacity</h2>
        <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="w-full text-sm text-center">
            <thead className="bg-primary/5 text-primary-foreground/80 font-semibold">
              <tr>
                <th className="px-4 py-3 text-primary">Container</th>
                <th className="px-4 py-3 text-primary">Pack Size</th>
                <th className="px-4 py-3 text-primary">Bags</th>
                <th className="px-4 py-3 text-primary">Total Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LOAD_CAPACITY.map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.container}</td>
                  <td className="px-4 py-3">{row.pack}</td>
                  <td className="px-4 py-3">{row.bags}</td>
                  <td className="px-4 py-3">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast Notification for Error */}
      {status === 'error' && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right z-50">
          <span>Error: {errorMessage}</span>
          <button onClick={() => setStatus('idle')} className="ml-auto hover:opacity-80">✕</button>
        </div>
      )}

    </main>
  );
}
