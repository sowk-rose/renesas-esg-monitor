import { COMPANIES, getESGColor, getTrendIcon, getTrendColor } from '../data.js';

const sorted = [...COMPANIES].sort((a, b) => b.scores.total - a.scores.total);
const renesas = COMPANIES.find(c => c.id === 'renesas');
const avg = {
  total: +(COMPANIES.reduce((s, c) => s + c.scores.total, 0) / COMPANIES.length).toFixed(1),
  environmental: +(COMPANIES.reduce((s, c) => s + c.scores.environmental, 0) / COMPANIES.length).toFixed(1),
  social: +(COMPANIES.reduce((s, c) => s + c.scores.social, 0) / COMPANIES.length).toFixed(1),
  governance: +(COMPANIES.reduce((s, c) => s + c.scores.governance, 0) / COMPANIES.length).toFixed(1),
};

export function renderBenchmark(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-4">
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Renesas Total</p>
          <p class="text-3xl font-extrabold text-navy-800">${renesas.scores.total}</p>
          <p class="text-xs text-gray-400 mt-1">Rank #${renesas.rank} of ${COMPANIES.length}</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Peer Average</p>
          <p class="text-3xl font-extrabold text-gray-600">${avg.total}</p>
          <p class="text-xs mt-1" style="color:${renesas.scores.total >= avg.total ? '#10B981' : '#EF4444'}">${renesas.scores.total >= avg.total ? '↑ Above' : '↓ Below'} average by ${Math.abs(renesas.scores.total - avg.total).toFixed(1)}</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Industry Leader</p>
          <p class="text-3xl font-extrabold" style="color:#10B981">${sorted[0].scores.total}</p>
          <p class="text-xs text-gray-400 mt-1">${sorted[0].name}</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Gap to Leader</p>
          <p class="text-3xl font-extrabold text-orange-500">${(sorted[0].scores.total - renesas.scores.total).toFixed(1)}</p>
          <p class="text-xs text-gray-400 mt-1">Points behind #1</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Bar Chart -->
        <div class="card p-6">
          <h3 class="text-base font-bold text-gray-900 mb-4">Total ESG Score Ranking</h3>
          <div style="height:320px"><canvas id="barChart"></canvas></div>
        </div>
        <!-- Radar Chart -->
        <div class="card p-6">
          <h3 class="text-base font-bold text-gray-900 mb-4">E/S/G Breakdown Comparison</h3>
          <div style="height:320px"><canvas id="radarChart"></canvas></div>
        </div>
      </div>

      <!-- Detailed Table -->
      <div class="card p-6">
        <h3 class="text-base font-bold text-gray-900 mb-4">Detailed Peer Comparison</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500">Rank</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500">Company</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500">Country</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500">Total</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500">Environmental</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500">Social</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500">Governance</th>
                <th class="text-center py-3 px-4 text-xs font-semibold text-gray-500">Trend</th>
              </tr>
            </thead>
            <tbody>
              ${sorted.map((c, i) => `
                <tr class="${c.id === 'renesas' ? 'bg-renesas-50 font-semibold' : 'hover:bg-gray-50'} border-b border-gray-100 transition-colors">
                  <td class="py-3 px-4">
                    <span class="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-navy-500 text-white' : 'bg-gray-200 text-gray-600'}">${i + 1}</span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <span class="${c.id === 'renesas' ? 'text-navy-800' : 'text-gray-800'}">${c.name}</span>
                      ${c.id === 'renesas' ? '<span class="badge bg-renesas-50 text-renesas-600">You</span>' : ''}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-500">${c.country}</td>
                  <td class="py-3 px-4 text-center font-bold text-navy-800">${c.scores.total}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" style="background:${getESGColor('E')}"></span>
                      ${c.scores.environmental}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" style="background:${getESGColor('S')}"></span>
                      ${c.scores.social}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" style="background:${getESGColor('G')}"></span>
                      ${c.scores.governance}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span style="color:${getTrendColor(c.trend)}" class="font-semibold">${getTrendIcon(c.trend)} ${c.trend}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gap Analysis -->
      <div class="card p-6">
        <h3 class="text-base font-bold text-gray-900 mb-4">Gap Analysis: Renesas vs. Industry Leader (${sorted[0].name})</h3>
        <div class="grid grid-cols-3 gap-6">
          ${['environmental', 'social', 'governance'].map(dim => {
            const label = dim.charAt(0).toUpperCase() + dim.slice(1);
            const cat = dim === 'environmental' ? 'E' : dim === 'social' ? 'S' : 'G';
            const gap = sorted[0].scores[dim] - renesas.scores[dim];
            return `
              <div class="p-4 rounded-xl bg-gray-50">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full" style="background:${getESGColor(cat)}"></span>
                  <span class="text-sm font-semibold text-gray-800">${label}</span>
                </div>
                <div class="flex items-end gap-4 mb-3">
                  <div>
                    <p class="text-[10px] text-gray-400">Renesas</p>
                    <p class="text-2xl font-bold text-navy-800">${renesas.scores[dim]}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400">${sorted[0].name.split(' ')[0]}</p>
                    <p class="text-2xl font-bold" style="color:${getESGColor(cat)}">${sorted[0].scores[dim]}</p>
                  </div>
                  <div class="ml-auto">
                    <p class="text-[10px] text-gray-400">Gap</p>
                    <p class="text-2xl font-bold text-orange-500">-${gap}</p>
                  </div>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${renesas.scores[dim]}%;background:${getESGColor(cat)}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Render charts
  setTimeout(() => {
    renderBarChart();
    renderRadarChart();
  }, 50);
}

function renderBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(c => c.name.split(' ')[0]),
      datasets: [{
        label: 'Total ESG Score',
        data: sorted.map(c => c.scores.total),
        backgroundColor: sorted.map(c => c.id === 'renesas' ? '#00A0E9' : '#CBD5E1'),
        borderRadius: 6,
        barThickness: 32,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: '#F1F5F9' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

function renderRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  const top3 = sorted.slice(0, 3);
  const colors = ['#003366', '#10B981', '#F59E0B'];
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Environmental', 'Social', 'Governance'],
      datasets: [
        {
          label: 'Renesas',
          data: [renesas.scores.environmental, renesas.scores.social, renesas.scores.governance],
          borderColor: '#00A0E9',
          backgroundColor: 'rgba(0,160,233,0.1)',
          borderWidth: 2,
          pointRadius: 4,
        },
        ...top3.filter(c => c.id !== 'renesas').map((c, i) => ({
          label: c.name.split(' ')[0],
          data: [c.scores.environmental, c.scores.social, c.scores.governance],
          borderColor: colors[i],
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 3,
        })),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true, pointStyle: 'circle' } } },
      scales: {
        r: { min: 50, max: 100, ticks: { stepSize: 10, font: { size: 10 } }, grid: { color: '#E2E8F0' }, pointLabels: { font: { size: 12, weight: '600' } } },
      },
    },
  });
}
