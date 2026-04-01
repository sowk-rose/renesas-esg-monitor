import { renderDashboard } from './pages/dashboard.js';
import { renderBenchmark } from './pages/benchmark.js';
import { renderRegulations } from './pages/regulations.js';
import { renderInsights } from './pages/insights.js';
import { renderActions } from './pages/actions.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>` },
  { id: 'benchmark', label: 'Benchmark', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>` },
  { id: 'regulations', label: 'Regulations', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>` },
  { id: 'insights', label: 'AI Insights', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>` },
  { id: 'actions', label: 'Actions', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>` },
];

let currentPage = 'dashboard';

function renderSidebar() {
  return `
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <!-- Logo -->
      <div class="p-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-500 to-renesas-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h1 class="text-sm font-bold text-navy-800">Renesas ESG</h1>
            <p class="text-[10px] text-gray-400 font-medium">Sustainability Monitor</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-3 px-3">
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        ${NAV_ITEMS.map(item => `
          <button onclick="window.navigateTo('${item.id}')" class="sidebar-item ${currentPage === item.id ? 'active' : ''} w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 mb-0.5">
            ${item.icon}
            <span>${item.label}</span>
          </button>
        `).join('')}
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100">
        <div class="bg-gradient-to-r from-navy-500 to-renesas-500 rounded-xl p-4 text-white">
          <p class="text-xs font-semibold mb-1">ESG Score</p>
          <p class="text-2xl font-bold">71.7</p>
          <p class="text-[10px] opacity-80 mt-1">Rank #4 of 8 peers</p>
          <div class="flex items-center gap-1 mt-2">
            <span class="text-[10px]">↑</span>
            <span class="text-[10px] opacity-90">Improving trend</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderHeader() {
  const titles = {
    dashboard: 'ESG Dashboard',
    benchmark: 'Peer Benchmark',
    regulations: 'Regulation Tracker',
    insights: 'AI Insights & News',
    actions: 'Action Center',
  };
  const subtitles = {
    dashboard: 'Renesas Electronics Corporation — Real-time ESG performance overview',
    benchmark: 'Competitive ESG analysis across 8 semiconductor peers',
    regulations: 'Monitor and track regulatory compliance status',
    insights: 'AI-powered analysis and live ESG news feed',
    actions: 'Action plans, templates, and executive reporting',
  };
  return `
    <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
      <div>
        <h2 class="text-xl font-bold text-gray-900">${titles[currentPage]}</h2>
        <p class="text-sm text-gray-500 mt-0.5">${subtitles[currentPage]}</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <div class="live-dot"></div>
          <span>Live monitoring</span>
        </div>
        <div class="text-xs text-gray-400">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </header>
  `;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="flex-1 flex flex-col overflow-hidden">
      ${renderHeader()}
      <div id="page-content" class="flex-1 overflow-y-auto p-8 fade-in"></div>
    </main>
  `;

  const content = document.getElementById('page-content');
  switch (currentPage) {
    case 'dashboard': renderDashboard(content); break;
    case 'benchmark': renderBenchmark(content); break;
    case 'regulations': renderRegulations(content); break;
    case 'insights': renderInsights(content); break;
    case 'actions': renderActions(content); break;
  }
}

window.navigateTo = function(page) {
  currentPage = page;
  render();
};

// Initial render
render();
