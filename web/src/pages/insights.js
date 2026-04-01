import { NEWS_ITEMS, getESGColor, getImpactColor } from '../data.js';

let filterCategory = 'all';
let filterImpact = 'all';
let selectedNewsId = null;
let aiAnalysisLoading = {};

function getFiltered() {
  return NEWS_ITEMS.filter(n => {
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    if (filterImpact !== 'all' && n.impactLevel !== filterImpact) return false;
    return true;
  });
}

export function renderInsights(container) {
  const filtered = getFiltered();
  const highImpact = NEWS_ITEMS.filter(n => n.impactLevel === 'high').length;
  const withAnalysis = NEWS_ITEMS.filter(n => n.aiAnalysis).length;
  const selected = selectedNewsId ? NEWS_ITEMS.find(n => n.id === selectedNewsId) : null;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-4">
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Total Articles</p>
          <p class="text-3xl font-extrabold text-navy-800">${NEWS_ITEMS.length}</p>
          <p class="text-xs text-gray-400 mt-1">ESG news tracked</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">High Impact</p>
          <p class="text-3xl font-extrabold text-orange-500">${highImpact}</p>
          <p class="text-xs text-gray-400 mt-1">Require attention</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">AI Analyzed</p>
          <p class="text-3xl font-extrabold text-renesas-500">${withAnalysis}</p>
          <p class="text-xs text-gray-400 mt-1">With AI insights</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Categories</p>
          <div class="flex gap-2 mt-2">
            ${['E', 'S', 'G'].map(cat => `
              <span class="badge" style="background:${getESGColor(cat)}15;color:${getESGColor(cat)}">${cat}: ${NEWS_ITEMS.filter(n => n.category === cat).length}</span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-gray-500">Category:</span>
        ${['all', 'E', 'S', 'G', 'ESG'].map(f => `
          <button class="filter-chip ${filterCategory === f ? 'active' : ''}" style="${filterCategory === f ? `background:${f === 'all' ? '#003366' : getESGColor(f)};border-color:${f === 'all' ? '#003366' : getESGColor(f)}` : ''}" onclick="window._newsFilter('category','${f}')">${f === 'all' ? 'All' : f}</button>
        `).join('')}
        <span class="text-xs font-semibold text-gray-500 ml-4">Impact:</span>
        ${['all', 'high', 'medium', 'low'].map(f => `
          <button class="filter-chip ${filterImpact === f ? 'active' : ''}" style="${filterImpact === f ? `background:${f === 'all' ? '#003366' : getImpactColor(f)};border-color:${f === 'all' ? '#003366' : getImpactColor(f)}` : ''}" onclick="window._newsFilter('impact','${f}')">${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        `).join('')}
      </div>

      <!-- Content: News List + Detail Panel -->
      <div class="grid grid-cols-5 gap-6">
        <!-- News List -->
        <div class="col-span-3 space-y-3">
          ${filtered.map(n => `
            <div class="card news-card p-5 ${selectedNewsId === n.id ? 'ring-2 ring-renesas-500' : ''}" onclick="window._newsSelect('${n.id}')">
              <div class="flex items-center gap-2 mb-2">
                <span class="badge" style="background:${getESGColor(n.category)}15;color:${getESGColor(n.category)}">${n.category}</span>
                <span class="badge" style="background:${getImpactColor(n.impactLevel)}15;color:${getImpactColor(n.impactLevel)}">${n.impactLevel.toUpperCase()}</span>
                <span class="text-xs text-gray-400">${n.region}</span>
                <span class="text-xs text-gray-400 ml-auto">${n.source} · ${n.date}</span>
              </div>
              <h4 class="text-sm font-bold text-gray-900 mb-1.5">${n.title}</h4>
              <p class="text-xs text-gray-600 leading-relaxed">${n.summary}</p>
              ${n.aiAnalysis ? `
                <div class="mt-3 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-renesas-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  <span class="text-[10px] font-semibold text-renesas-500">AI Analysis Available</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
          ${filtered.length === 0 ? '<div class="card p-8 text-center text-gray-400 text-sm">No articles match the selected filters.</div>' : ''}
        </div>

        <!-- Detail Panel -->
        <div class="col-span-2">
          ${selected ? `
            <div class="card p-6 sticky top-0 fade-in">
              <div class="flex items-center gap-2 mb-3">
                <span class="badge" style="background:${getESGColor(selected.category)}15;color:${getESGColor(selected.category)}">${selected.category}</span>
                <span class="badge" style="background:${getImpactColor(selected.impactLevel)}15;color:${getImpactColor(selected.impactLevel)}">${selected.impactLevel.toUpperCase()}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">${selected.title}</h3>
              <div class="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span>${selected.source}</span>
                <span>·</span>
                <span>${selected.date}</span>
                <span>·</span>
                <span>${selected.region}</span>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 class="text-xs font-semibold text-gray-500 mb-2">Summary</h4>
                <p class="text-sm text-gray-700 leading-relaxed">${selected.summary}</p>
              </div>
              ${selected.aiAnalysis ? `
                <div class="bg-renesas-50 rounded-lg p-4 mb-4 border border-renesas-100">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-renesas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                    <h4 class="text-xs font-semibold text-renesas-700">AI Impact Analysis</h4>
                  </div>
                  <p class="text-sm text-renesas-800 leading-relaxed">${selected.aiAnalysis}</p>
                </div>
              ` : `
                <div class="bg-gray-50 rounded-lg p-4 mb-4 border border-dashed border-gray-300">
                  <div class="text-center">
                    <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                    <p class="text-xs text-gray-400 mb-2">No AI analysis yet</p>
                    <button class="text-xs font-semibold text-renesas-500 hover:underline" onclick="window._requestAnalysis('${selected.id}')">Request AI Analysis →</button>
                  </div>
                </div>
              `}
              <div class="flex gap-2">
                <button class="flex-1 py-2 px-4 rounded-lg bg-navy-500 text-white text-xs font-semibold hover:bg-navy-600 transition-colors" onclick="window.navigateTo('actions')">Create Action Item</button>
                <button class="py-2 px-4 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors" onclick="window._newsSelect(null)">Close</button>
              </div>
            </div>
          ` : `
            <div class="card p-8 text-center sticky top-0">
              <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              <p class="text-sm text-gray-400 mb-1">Select an article to view details</p>
              <p class="text-xs text-gray-300">Click on any news item to see the full analysis</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

window._newsFilter = function(type, value) {
  if (type === 'category') filterCategory = value;
  if (type === 'impact') filterImpact = value;
  selectedNewsId = null;
  const content = document.getElementById('page-content');
  renderInsights(content);
};

window._newsSelect = function(id) {
  selectedNewsId = id;
  const content = document.getElementById('page-content');
  renderInsights(content);
};

window._requestAnalysis = function(id) {
  // Simulate AI analysis request
  const news = NEWS_ITEMS.find(n => n.id === id);
  if (news) {
    news.aiAnalysis = "Based on AI analysis: This development has moderate-to-high relevance for Renesas Electronics. The company should monitor this closely and consider proactive engagement with relevant stakeholders. Recommend scheduling a cross-functional review within the next 30 days to assess potential impacts on current ESG strategy and reporting obligations.";
    const content = document.getElementById('page-content');
    renderInsights(content);
  }
};
