export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300');
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/CL%3DF?interval=1d&range=5d';
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const d = await r.json();
    const result = d.chart.result[0];
    const closes = result.indicators.quote[0].close;
    const validCloses = closes.filter(c => c !== null && c !== undefined);
    const price = validCloses[validCloses.length - 1];
    const prev = validCloses[validCloses.length - 2];
    const change = prev ? ((price - prev) / prev * 100) : 0;
    res.status(200).json({ price, change, symbol: 'CL=F', name: 'WTI Crude Oil' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
