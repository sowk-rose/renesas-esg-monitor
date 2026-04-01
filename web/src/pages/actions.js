import { ACTION_ITEMS, TEMPLATES, REGULATIONS, COMPANIES, NEWS_ITEMS, getESGColor, getImpactColor, getStatusColor } from '../data.js';

let activeTab = 'actions'; // actions | templates | report
let filterPriority = 'all';
let filterDept = 'all';

const departments = [...new Set(ACTION_ITEMS.map(a => a.assignedDepartment))];

function getFilteredActions() {
  return ACTION_ITEMS.filter(a => {
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    if (filterDept !== 'all' && a.assignedDepartment !== filterDept) return false;
    return true;
  });
}

function renderActionsList() {
  const filtered = getFilteredActions();
  const totalProgress = Math.round(ACTION_ITEMS.reduce((s, a) => s + a.progress, 0) / ACTION_ITEMS.length);
  return `
    <!-- Summary -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card p-5">
        <p class="text-xs font-semibold text-gray-500 mb-1">Total Actions</p>
        <p class="text-3xl font-extrabold text-navy-800">${ACTION_ITEMS.length}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs font-semibold text-gray-500 mb-1">Avg. Progress</p>
        <p class="text-3xl font-extrabold" style="color:${totalProgress >= 50 ? '#10B981' : '#F59E0B'}">${totalProgress}%</p>
      </div>
      <div class="card p-5">
        <p class="text-xs font-semibold text-gray-500 mb-1">Critical</p>
        <p class="text-3xl font-extrabold text-red-500">${ACTION_ITEMS.filter(a => a.priority === 'critical').length}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs font-semibold text-gray-500 mb-1">Departments</p>
        <p class="text-3xl font-extrabold text-renesas-500">${departments.length}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-4">
      <span class="text-xs font-semibold text-gray-500">Priority:</span>
      ${['all', 'critical', 'high', 'medium'].map(f => `
        <button class="filter-chip ${filterPriority === f ? 'active' : ''}" style="${filterPriority === f ? `background:${f === 'all' ? '#003366' : getImpactColor(f)};border-color:${f === 'all' ? '#003366' : getImpactColor(f)}` : ''}" onclick="window._actionFilter('priority','${f}')">${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
      `).join('')}
      <span class="text-xs font-semibold text-gray-500 ml-4">Department:</span>
      <button class="filter-chip ${filterDept === 'all' ? 'active' : ''}" style="${filterDept === 'all' ? 'background:#003366;border-color:#003366' : ''}" onclick="window._actionFilter('dept','all')">All</button>
      ${departments.map(d => `
        <button class="filter-chip ${filterDept === d ? 'active' : ''}" style="${filterDept === d ? 'background:#003366;border-color:#003366' : ''}" onclick="window._actionFilter('dept','${d}')">${d}</button>
      `).join('')}
    </div>

    <!-- Action Items -->
    <div class="space-y-3">
      ${filtered.map(a => `
        <div class="card p-5">
          <div class="flex items-start gap-4">
            <div class="shrink-0 mt-1">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:${getESGColor(a.category)}15">
                <span class="text-sm font-bold" style="color:${getESGColor(a.category)}">${a.category}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-sm font-bold text-gray-900">${a.title}</h4>
                <span class="badge" style="background:${getImpactColor(a.priority)}15;color:${getImpactColor(a.priority)}">${a.priority.toUpperCase()}</span>
                <span class="badge" style="background:${getStatusColor(a.status)}15;color:${getStatusColor(a.status)}">${a.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
              </div>
              <p class="text-xs text-gray-600 mb-2 line-clamp-2">${a.description}</p>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span>📋 ${a.assignedDepartment}</span>
                <span>📅 Due: ${a.deadline}</span>
              </div>
            </div>
            <div class="shrink-0 w-24 text-right">
              <p class="text-2xl font-bold text-navy-800">${a.progress}%</p>
              <div class="progress-bar mt-2">
                <div class="progress-fill" style="width:${a.progress}%;background:${getStatusColor(a.status)}"></div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTemplates() {
  return `
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="col-span-3 card p-6 bg-gradient-to-r from-navy-500 to-renesas-500 text-white">
        <h3 class="text-lg font-bold mb-1">ESG Response Templates</h3>
        <p class="text-sm opacity-80">Pre-built templates, checklists, and decision frameworks to accelerate ESG response planning.</p>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
      ${TEMPLATES.map(t => `
        <div class="card p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background:${getESGColor(t.category)}15">
              <span class="text-sm font-bold" style="color:${getESGColor(t.category)}">${t.category}</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900">${t.name}</h4>
              <span class="badge" style="background:${getESGColor(t.category)}15;color:${getESGColor(t.category)}">${t.category}</span>
            </div>
          </div>
          <p class="text-xs text-gray-600 mb-4">${t.description}</p>
          <div class="space-y-1.5">
            ${t.steps.map((s, i) => `
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">${i + 1}</span>
                <span class="text-xs text-gray-600">${s}</span>
              </div>
            `).join('')}
          </div>
          <button class="mt-4 w-full py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors">Use Template</button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderReport() {
  const renesas = COMPANIES.find(c => c.id === 'renesas');
  const criticalActions = ACTION_ITEMS.filter(a => a.priority === 'critical');
  const highImpactRegs = REGULATIONS.filter(r => r.impactLevel === 'critical' || r.impactLevel === 'high');
  const highImpactNews = NEWS_ITEMS.filter(n => n.impactLevel === 'high');
  const avgProgress = Math.round(ACTION_ITEMS.reduce((s, a) => s + a.progress, 0) / ACTION_ITEMS.length);

  return `
    <div class="card p-8 max-w-4xl mx-auto">
      <!-- Report Header -->
      <div class="border-b border-gray-200 pb-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-navy-800">ESG Executive Summary</h3>
            <p class="text-sm text-gray-500">Renesas Electronics Corporation · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge bg-green-50 text-green-600">AI Generated</span>
          </div>
        </div>
      </div>

      <!-- Score Overview -->
      <div class="mb-6">
        <h4 class="text-sm font-bold text-navy-800 mb-3 uppercase tracking-wider">Performance Overview</h4>
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-extrabold text-navy-800">${renesas.scores.total}</p>
            <p class="text-xs text-gray-500 mt-1">Total ESG Score</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-extrabold" style="color:${getESGColor('E')}">${renesas.scores.environmental}</p>
            <p class="text-xs text-gray-500 mt-1">Environmental</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-extrabold" style="color:${getESGColor('S')}">${renesas.scores.social}</p>
            <p class="text-xs text-gray-500 mt-1">Social</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-extrabold" style="color:${getESGColor('G')}">${renesas.scores.governance}</p>
            <p class="text-xs text-gray-500 mt-1">Governance</p>
          </div>
        </div>
      </div>

      <!-- Key Findings -->
      <div class="mb-6">
        <h4 class="text-sm font-bold text-navy-800 mb-3 uppercase tracking-wider">Key Findings</h4>
        <div class="bg-renesas-50 rounded-lg p-4 border border-renesas-100">
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-start gap-2"><span class="text-renesas-500 mt-0.5">●</span> Overall ESG score of ${renesas.scores.total} places Renesas at rank #${renesas.rank} among 8 semiconductor peers, with an improving trend.</li>
            <li class="flex items-start gap-2"><span class="text-renesas-500 mt-0.5">●</span> ${criticalActions.length} critical action items require immediate attention, with an average progress of ${avgProgress}% across all initiatives.</li>
            <li class="flex items-start gap-2"><span class="text-renesas-500 mt-0.5">●</span> ${highImpactRegs.length} high-impact regulations are being tracked, with EU CSRD and Japan GX Act requiring priority compliance efforts.</li>
            <li class="flex items-start gap-2"><span class="text-renesas-500 mt-0.5">●</span> Environmental score (${renesas.scores.environmental}) represents the largest gap vs. industry leader (${COMPANIES.sort((a,b) => b.scores.environmental - a.scores.environmental)[0].scores.environmental}), suggesting focus on carbon reduction and water stewardship.</li>
          </ul>
        </div>
      </div>

      <!-- Priority Actions -->
      <div class="mb-6">
        <h4 class="text-sm font-bold text-navy-800 mb-3 uppercase tracking-wider">Priority Actions for Management</h4>
        <div class="space-y-2">
          ${criticalActions.concat(ACTION_ITEMS.filter(a => a.priority === 'high')).slice(0, 5).map((a, i) => `
            <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <span class="w-6 h-6 rounded-full bg-navy-500 text-white flex items-center justify-center text-xs font-bold">${i + 1}</span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-800">${a.title}</p>
                <p class="text-xs text-gray-500">${a.assignedDepartment} · Due: ${a.deadline}</p>
              </div>
              <span class="badge" style="background:${getImpactColor(a.priority)}15;color:${getImpactColor(a.priority)}">${a.priority.toUpperCase()}</span>
              <span class="text-sm font-bold text-navy-800">${a.progress}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Regulatory Landscape -->
      <div class="mb-6">
        <h4 class="text-sm font-bold text-navy-800 mb-3 uppercase tracking-wider">Regulatory Landscape</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500">Regulation</th>
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500">Jurisdiction</th>
                <th class="text-center py-2 px-3 text-xs font-semibold text-gray-500">Impact</th>
                <th class="text-center py-2 px-3 text-xs font-semibold text-gray-500">Compliance</th>
                <th class="text-left py-2 px-3 text-xs font-semibold text-gray-500">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${highImpactRegs.slice(0, 5).map(r => `
                <tr class="border-b border-gray-100">
                  <td class="py-2 px-3 font-medium text-gray-800">${r.name}</td>
                  <td class="py-2 px-3 text-gray-500">${r.jurisdiction}</td>
                  <td class="py-2 px-3 text-center"><span class="badge" style="background:${getImpactColor(r.impactLevel)}15;color:${getImpactColor(r.impactLevel)}">${r.impactLevel.toUpperCase()}</span></td>
                  <td class="py-2 px-3 text-center font-bold">${r.compliance}%</td>
                  <td class="py-2 px-3 text-gray-500">${r.effectiveDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cross-Functional Alignment -->
      <div class="mb-6">
        <h4 class="text-sm font-bold text-navy-800 mb-3 uppercase tracking-wider">Cross-Functional Alignment</h4>
        <div class="grid grid-cols-3 gap-3">
          ${departments.map(d => {
            const deptActions = ACTION_ITEMS.filter(a => a.assignedDepartment === d);
            const deptProgress = deptActions.length > 0 ? Math.round(deptActions.reduce((s, a) => s + a.progress, 0) / deptActions.length) : 0;
            return `
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-semibold text-gray-700">${d}</span>
                  <span class="text-xs font-bold text-navy-800">${deptActions.length} items</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${deptProgress}%;background:#00A0E9"></div>
                </div>
                <p class="text-[10px] text-gray-400 mt-1">${deptProgress}% avg. progress</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
        <p class="text-xs text-gray-400">Generated by Renesas ESG Monitor · AI-Powered Analysis</p>
        <button class="py-2 px-6 rounded-lg bg-navy-500 text-white text-xs font-semibold hover:bg-navy-600 transition-colors" onclick="window.print()">Export Report</button>
      </div>
    </div>
  `;
}

export function renderActions(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Tabs -->
      <div class="flex items-center gap-2">
        <button class="tab-btn ${activeTab === 'actions' ? 'active' : ''}" onclick="window._actionTab('actions')">Action Items</button>
        <button class="tab-btn ${activeTab === 'templates' ? 'active' : ''}" onclick="window._actionTab('templates')">Templates & Tools</button>
        <button class="tab-btn ${activeTab === 'report' ? 'active' : ''}" onclick="window._actionTab('report')">Executive Report</button>
      </div>

      <!-- Content -->
      <div class="fade-in">
        ${activeTab === 'actions' ? renderActionsList() : ''}
        ${activeTab === 'templates' ? renderTemplates() : ''}
        ${activeTab === 'report' ? renderReport() : ''}
      </div>
    </div>
  `;
}

window._actionTab = function(tab) {
  activeTab = tab;
  filterPriority = 'all';
  filterDept = 'all';
  const content = document.getElementById('page-content');
  renderActions(content);
};

window._actionFilter = function(type, value) {
  if (type === 'priority') filterPriority = value;
  if (type === 'dept') filterDept = value;
  const content = document.getElementById('page-content');
  renderActions(content);
};
