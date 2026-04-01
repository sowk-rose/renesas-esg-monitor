import { REGULATIONS, getESGColor, getImpactColor, getStatusColor } from '../data.js';

let filterImpact = 'all';
let filterStatus = 'all';
let expandedId = null;

function getFiltered() {
  return REGULATIONS.filter(r => {
    if (filterImpact !== 'all' && r.impactLevel !== filterImpact) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });
}

function getDaysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function renderRegulations(container) {
  const filtered = getFiltered();
  const avgCompliance = Math.round(REGULATIONS.reduce((s, r) => s + r.compliance, 0) / REGULATIONS.length);
  const criticalCount = REGULATIONS.filter(r => r.impactLevel === 'critical').length;
  const upcomingCount = REGULATIONS.filter(r => getDaysUntil(r.effectiveDate) <= 180 && getDaysUntil(r.effectiveDate) > 0).length;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-4 gap-4">
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Total Regulations</p>
          <p class="text-3xl font-extrabold text-navy-800">${REGULATIONS.length}</p>
          <p class="text-xs text-gray-400 mt-1">Being tracked</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Avg. Compliance</p>
          <p class="text-3xl font-extrabold" style="color:${avgCompliance >= 50 ? '#10B981' : '#F59E0B'}">${avgCompliance}%</p>
          <p class="text-xs text-gray-400 mt-1">Across all regulations</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Critical Impact</p>
          <p class="text-3xl font-extrabold text-red-500">${criticalCount}</p>
          <p class="text-xs text-gray-400 mt-1">Require priority action</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-semibold text-gray-500 mb-1">Due Within 6 Months</p>
          <p class="text-3xl font-extrabold text-orange-500">${upcomingCount}</p>
          <p class="text-xs text-gray-400 mt-1">Upcoming deadlines</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-gray-500">Impact:</span>
        ${['all', 'critical', 'high', 'medium'].map(f => `
          <button class="filter-chip ${filterImpact === f ? 'active' : ''}" style="${filterImpact === f ? `background:${f === 'all' ? '#003366' : getImpactColor(f)};border-color:${f === 'all' ? '#003366' : getImpactColor(f)}` : ''}" onclick="window._regFilter('impact','${f}')">${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        `).join('')}
        <span class="text-xs font-semibold text-gray-500 ml-4">Status:</span>
        ${['all', 'in-progress', 'planning', 'monitoring', 'compliant'].map(f => `
          <button class="filter-chip ${filterStatus === f ? 'active' : ''}" style="${filterStatus === f ? `background:${f === 'all' ? '#003366' : getStatusColor(f)};border-color:${f === 'all' ? '#003366' : getStatusColor(f)}` : ''}" onclick="window._regFilter('status','${f}')">${f === 'all' ? 'All' : f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</button>
        `).join('')}
      </div>

      <!-- Compliance Overview Chart -->
      <div class="card p-6">
        <h3 class="text-base font-bold text-gray-900 mb-4">Compliance Progress Overview</h3>
        <div style="height:250px"><canvas id="complianceChart"></canvas></div>
      </div>

      <!-- Regulation Cards -->
      <div class="space-y-3">
        ${filtered.map(r => {
          const days = getDaysUntil(r.effectiveDate);
          const isExpanded = expandedId === r.id;
          const urgency = days <= 90 ? 'Urgent' : days <= 180 ? 'Approaching' : 'On Track';
          const urgencyColor = days <= 90 ? '#EF4444' : days <= 180 ? '#F59E0B' : '#10B981';
          return `
            <div class="card overflow-hidden cursor-pointer" onclick="window._regToggle('${r.id}')">
              <div class="p-5">
                <div class="flex items-start gap-4">
                  <!-- Left: Impact badge -->
                  <div class="shrink-0 w-16 text-center">
                    <span class="badge text-xs" style="background:${getImpactColor(r.impactLevel)}15;color:${getImpactColor(r.impactLevel)}">${r.impactLevel.toUpperCase()}</span>
                    <p class="text-[10px] text-gray-400 mt-1">${r.jurisdiction}</p>
                  </div>
                  <!-- Center: Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="text-sm font-bold text-gray-900">${r.name}</h4>
                      <span class="badge" style="background:${getESGColor(r.category)}15;color:${getESGColor(r.category)}">${r.category}</span>
                      <span class="badge" style="background:${getStatusColor(r.status)}15;color:${getStatusColor(r.status)}">${r.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                    <p class="text-xs text-gray-500">${r.fullName}</p>
                  </div>
                  <!-- Right: Progress + Deadline -->
                  <div class="shrink-0 text-right">
                    <p class="text-2xl font-bold text-navy-800">${r.compliance}%</p>
                    <div class="flex items-center gap-1 mt-1">
                      <span class="w-2 h-2 rounded-full" style="background:${urgencyColor}"></span>
                      <span class="text-[10px] font-semibold" style="color:${urgencyColor}">${urgency} · ${days > 0 ? days + 'd' : 'Overdue'}</span>
                    </div>
                    <p class="text-[10px] text-gray-400 mt-0.5">Due: ${r.effectiveDate}</p>
                  </div>
                </div>
                <!-- Progress Bar -->
                <div class="mt-3 progress-bar">
                  <div class="progress-fill" style="width:${r.compliance}%;background:${getStatusColor(r.status)}"></div>
                </div>
              </div>
              ${isExpanded ? `
                <div class="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50 fade-in">
                  <p class="text-sm text-gray-700 mb-3">${r.description}</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-gray-500">Departments:</span>
                    ${r.departments.map(d => `<span class="badge bg-navy-50 text-navy-600">${d}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Render chart
  setTimeout(renderComplianceChart, 50);
}

function renderComplianceChart() {
  const ctx = document.getElementById('complianceChart');
  if (!ctx) return;
  const sortedRegs = [...REGULATIONS].sort((a, b) => b.compliance - a.compliance);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedRegs.map(r => r.name),
      datasets: [{
        label: 'Compliance %',
        data: sortedRegs.map(r => r.compliance),
        backgroundColor: sortedRegs.map(r => getStatusColor(r.status) + '80'),
        borderColor: sortedRegs.map(r => getStatusColor(r.status)),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 28,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 100, grid: { color: '#F1F5F9' }, ticks: { font: { size: 11 }, callback: v => v + '%' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

window._regFilter = function(type, value) {
  if (type === 'impact') filterImpact = value;
  if (type === 'status') filterStatus = value;
  const content = document.getElementById('page-content');
  renderRegulations(content);
};

window._regToggle = function(id) {
  expandedId = expandedId === id ? null : id;
  const content = document.getElementById('page-content');
  renderRegulations(content);
};
