import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, Check, ChevronRight, Clock3, RefreshCw, Search, Sparkles } from 'lucide-react';
import { useMarketsData } from '../hooks/useMarketsData';

const currencies = {
  USD: { country: 'United States', flag: '🇺🇸' }, GBP: { country: 'United Kingdom', flag: '🇬🇧' }, EUR: { country: 'Euro area', flag: '🇪🇺' }, JPY: { country: 'Japan', flag: '🇯🇵' }, SGD: { country: 'Singapore', flag: '🇸🇬' }, THB: { country: 'Thailand', flag: '🇹🇭' }, CNY: { country: 'China', flag: '🇨🇳' }, MYR: { country: 'Malaysia', flag: '🇲🇾' }, TWD: { country: 'Taiwan', flag: '🇹🇼' }, BDT: { country: 'Bangladesh', flag: '🇧🇩' }, VND: { country: 'Vietnam', flag: '🇻🇳' }, NZD: { country: 'New Zealand', flag: '🇳🇿' }, AUD: { country: 'Australia', flag: '🇦🇺' }, KRW: { country: 'South Korea', flag: '🇰🇷' }, INR: { country: 'India', flag: '🇮🇳' }, RUB: { country: 'Russia', flag: '🇷🇺' }, XAU: { country: 'Gold', flag: '✦' }, XAG: { country: 'Silver', flag: '◈' },
};
const priority = ['USD', 'THB', 'SGD', 'EUR', 'GBP', 'JPY', 'CNY', 'MYR', 'AUD', 'KRW', 'INR', 'TWD', 'BDT', 'VND', 'NZD', 'RUB', 'XAU', 'XAG'];
const formatRate = (value) => value < 10 ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fallbackPrices = { USD: 4200, THB: 115, SGD: 3125, EUR: 4580, GBP: 5385, JPY: 28.4, CNY: 580, MYR: 905, AUD: 2735, KRW: 3.05, INR: 50.2, TWD: 130, BDT: 34.8, VND: 0.165, NZD: 2460, RUB: 43.5, XAU: 10150000, XAG: 112500 };

export default function ExchangeRatesBoard() {
  const { fiatMarkets, isLoading, error } = useMarketsData();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MMK');
  const [amount, setAmount] = useState('100');
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);

  const rateData = useMemo(() => priority.map((currency) => {
    const pair = fiatMarkets.find((market) => market.symbol === `${currency}/MMK`);
    const mid = pair?.price || fallbackPrices[currency];
    return { currency, ...currencies[currency], mid, buy: mid * 0.995, sell: mid * 1.005 };
  }), [fiatMarkets]);
  const allCurrencies = [{ currency: 'MMK', country: 'Myanmar', flag: '🇲🇲', mid: 1 }, ...rateData];
  const selected = rateData.find((row) => row.currency === selectedCurrency) || rateData[0];
  const from = allCurrencies.find((row) => row.currency === fromCurrency) || allCurrencies[0];
  const to = allCurrencies.find((row) => row.currency === toCurrency) || allCurrencies[0];
  const rate = from && to ? from.mid / to.mid : 0;
  const result = Number(amount || 0) * rate;
  const filteredRates = rateData.filter((row) => `${row.currency} ${row.country}`.toLowerCase().includes(query.toLowerCase()));
  const myanmarTime = now.toLocaleString('en-GB', { timeZone: 'Asia/Yangon', hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short', year: 'numeric' });
  const selectCurrency = (currency) => { setSelectedCurrency(currency); setFromCurrency(currency); setQuery(''); };
  const swapCurrencies = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); };

  return <main className="exchange-shell">
    <section className="exchange-hero"><div className="hero-noise" /><div className="hero-copy"><div className="eyebrow"><Sparkles size={13} /> Live rates / Myanmar</div><h1>Move money with<br /><span>clarity.</span></h1><p>Explore live exchange rates across the world, then calculate exactly what your money is worth in Myanmar kyat.</p><div className="hero-meta"><span className="live-dot" /> Market data updating now <span className="hero-divider" /> Independent exchange guide</div></div>
      <div className="converter-card"><div className="card-topline"><span>Quick conversion</span><ArrowDownUp size={16} /></div><div className="converter-input-group"><label>YOU SEND</label><div className="converter-input-row"><input aria-label="Amount to convert" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} /><select aria-label="From currency" className="currency-select" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>{allCurrencies.map((row) => <option key={row.currency} value={row.currency}>{row.flag} {row.currency}</option>)}</select></div></div><button className="swap-button" onClick={swapCurrencies} aria-label="Swap selected currencies"><ArrowDownUp size={15} /></button><div className="converter-input-group output-group"><label>YOU RECEIVE</label><div className="converter-input-row"><div className="conversion-result">{result ? result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}</div><select aria-label="To currency" className="currency-select" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>{allCurrencies.map((row) => <option key={row.currency} value={row.currency}>{row.flag} {row.currency}</option>)}</select></div></div><div className="converter-footer"><span>1 {from?.currency} equals</span><strong>{rate ? formatRate(rate) : '—'} {to?.currency}</strong></div></div>
    </section>
    <section className="rates-area"><div className="section-heading"><div><div className="eyebrow">Market board</div><h2>Rates without the noise.</h2></div><div className="market-time"><Clock3 size={15} /><span>{myanmarTime} MMT</span></div></div>
      <div className="country-rail" aria-label="Choose a country">{rateData.slice(0, 8).map((row) => <button key={row.currency} onClick={() => selectCurrency(row.currency)} className={`country-chip ${selected?.currency === row.currency ? 'selected' : ''}`}><span className="country-flag">{row.flag}</span><span><b>{row.currency}</b><small>{row.country}</small></span>{selected?.currency === row.currency && <Check size={14} />}</button>)}</div>
      <div className="rates-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country or currency" /></div><span className="rate-reference">MMK reference</span><button className="refresh-action" onClick={() => window.location.reload()} title="Refresh rates"><RefreshCw size={16} /> <span>Refresh</span></button></div>
      <div className="rates-list" role="table" aria-label="Live exchange rates"><div className="rates-header" role="row"><span>Currency</span><span>We buy</span><span>We sell</span><span /></div>{isLoading && fiatMarkets.length === 0 ? <div className="rates-empty">Loading live market rates…</div> : filteredRates.length === 0 ? <div className="rates-empty">No currency matches that search.</div> : filteredRates.map((row) => <button className={`rate-row ${selected?.currency === row.currency ? 'active-row' : ''}`} key={row.currency} onClick={() => selectCurrency(row.currency)} role="row"><span className="rate-currency"><i>{row.flag}</i><span><b>{row.currency}</b><small>{row.country}</small></span></span><span className="rate-value buy-value">{formatRate(row.buy)} <small>MMK</small></span><span className="rate-value sell-value">{formatRate(row.sell)} <small>MMK</small></span><ChevronRight size={18} className="row-arrow" /></button>)}</div><p className="rates-disclaimer">{error ? 'Showing indicative fallback rates while the live feed reconnects. ' : ''}Rates are indicative and may change at any time. Confirm the final rate before making an exchange.</p>
    </section>
  </main>;
}
