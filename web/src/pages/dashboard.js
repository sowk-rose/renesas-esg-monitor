import { COMPANIES, REGULATIONS, NEWS_ITEMS, ACTION_ITEMS, getESGColor, getImpactColor, getStatusColor, getTrendIcon, getTrendColor } from '../data.js';

const renesas = COMPANIES.find(c => c.id === 'renesas');
const criticalRegs = REGULATIONS.filter(r => r.impactLevel === 'critical' || r.impactLevel === 'high');
const activeActions = ACTION_ITEMS.filter(a => a.status !== 'completed');

function scoreRingHTML(score, label, color, size = 80) {
  const pct = score / 100;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - pct);
  return `
    <div class="flex flex-col items-center gap-1">
      <div class="relative" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" stroke-width="5"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 40 40)"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold" style="color:${color}">${score}</span>
        </div>
      </div>
      <span class="text-xs font-medium text-gray-500">${label}</span>
    </div>
  `;
}

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Top Row: Score + Alerts -->
      <div class="grid grid-cols-3 gap-6">
        <!-- ESG Score Card -->
        <div class="col-span-2 card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-gray-900">ESG Performance Overview</h3>
              <p class="text-sm text-gray-500">Updated: ${renesas.lastUpdated}</p>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full" style="background:${getTrendColor(renesas.trend)}15">
              <span style="color:${getTrendColor(renesas.trend)}" class="text-sm font-semibold">${getTrendIcon(renesas.trend)} ${renesas.trend.charAt(0).toUpperCase() + renesas.trend.slice(1)}</span>
            </div>
          </div>
          <div class="flex items-center gap-12">
            <!-- Main Score -->
            <div class="flex flex-col items-center">
              <div class="relative" style="width:120px;height:120px">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" stroke-width="7"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#003366" stroke-width="7" stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="${2 * Math.PI * 52 * (1 - renesas.scores.total / 100)}" transform="rotate(-90 60 60)"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-3xl font-extrabold text-navy-800">${renesas.scores.total}</span>
                  <span class="text-[10px] text-gray-400 font-medium">/ 100</span>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2 font-medium">Rank #${renesas.rank} of 8 peers</p>
            </div>
            <!-- E/S/G Breakdown -->
            <div class="flex gap-8">
              ${scoreRingHTML(renesas.scores.environmental, 'Environmental', getESGColor('E'))}
              ${scoreRingHTML(renesas.scores.social, 'Social', getESGColor('S'))}
              ${scoreRingHTML(renesas.scores.governance, 'Governance', getESGColor('G'))}
            </div>
            <!-- Peer Comparison Mini -->
            <div class="flex-1 ml-4">
              <p class="text-xs font-semibold text-gray-500 mb-3">Peer Comparison</p>
              <div class="space-y-2">
                ${COMPANIES.slice(0, 5).map(c => `
                  <div class="flex items-center gap-2">
                    <span class="text-xs w-24 truncate ${c.id === 'renesas' ? 'font-bold text-navy-800' : 'text-gray-600'}">${c.name.split(' ')[0]}</span>
                    <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full ${c.id === 'renesas' ? 'bg-renesas-500' : 'bg-gray-300'}" style="width:${c.scores.total}%"></div>
                    </div>
                    <span class="text-xs font-semibold ${c.id === 'renesas' ? 'text-navy-800' : 'text-gray-500'}">${c.scores.total}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Alerts -->
        <div class="card p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Risk Alerts</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 rounded-lg" style="background:#EF444410;border-left:3px solid #EF4444">
              <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">${activeActions.filter(a => a.priority === 'critical').length}</div>
              <div>
                <p class="text-sm font-semibold text-gray-800">Critical Actions</p>
                <p class="text-xs text-gray-500">Require immediate attention</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-lg" style="background:#F9731610;border-left:3px solid #F97316">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#F97316">${criticalRegs.length}</div>
              <div>
                <p class="text-sm font-semibold text-gray-800">High-Impact Regulations</p>
                <p class="text-xs text-gray-500">Compliance action needed</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-lg" style="background:#00336610;border-left:3px solid #003366">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#003366">${NEWS_ITEMS.filter(n => n.impactLevel === 'high').length}</div>
              <div>
                <p class="text-sm font-semibold text-gray-800">ESG Developments</p>
                <p class="text-xs text-gray-500">High-impact news items</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 rounded-lg" style="background:#F59E0B10;border-left:3px solid #F59E0B">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#F59E0B">${REGULATIONS.filter(r => r.compliance < 50).length}</div>
              <div>
                <p class="text-sm font-semibold text-gray-800">Low Compliance</p>
                <p class="text-xs text-gray-500">Below 50% completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Row: Regulations + News -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Key Regulations -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Key Regulations</h3>
            <button onclick="window.navigateTo('regulations')" class="text-xs font-semibold text-renesas-500 hover:underline">View All →</button>
          </div>
          <div class="space-y-3">
            ${criticalRegs.slice(0, 4).map(r => `
              <div class="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="shrink-0">
                  <span class="badge" style="background:${getImpactColor(r.impactLevel)}15;color:${getImpactColor(r.impactLevel)}">${r.impactLevel.toUpperCase()}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">${r.name}</p>
                  <p class="text-xs text-gray-500">${r.jurisdiction} · Due: ${r.effectiveDate}</p>
                </div>
                <div class="shrink-0 w-16">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width:${r.compliance}%;background:${getStatusColor(r.status)}"></div>
                  </div>
                  <p class="text-[10px] text-gray-400 text-center mt-1">${r.compliance}%</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Latest News -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-gray-900">Latest ESG News</h3>
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50">
                <div class="live-dot" style="width:5px;height:5px"></div>
                <span class="text-[10px] font-semibold text-red-500">LIVE</span>
              </div>
            </div>
            <button onclick="window.navigateTo('insights')" class="text-xs font-semibold text-renesas-500 hover:underline">View All →</button>
          </div>
          <div class="space-y-3">
            ${NEWS_ITEMS.slice(0, 4).map(n => `
              <div class="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onclick="window.navigateTo('insights')">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="badge" style="background:${getESGColor(n.category)}15;color:${getESGColor(n.category)}">${n.category}</span>
                  <span class="badge" style="background:${getImpactColor(n.impactLevel)}15;color:${getImpactColor(n.impactLevel)}">${n.impactLevel.toUpperCase()}</span>
                  <span class="text-[10px] text-gray-400 ml-auto">${n.date}</span>
                </div>
                <p class="text-sm font-semibold text-gray-800 line-clamp-1">${n.title}</p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1">${n.summary}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Bottom Row: Action Items -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Priority Action Items</h3>
          <button onclick="window.navigateTo('actions')" class="text-xs font-semibold text-renesas-500 hover:underline">View All →</button>
        </div>
        <div class="grid grid-cols-4 gap-4">
          ${activeActions.filter(a => a.priority === 'critical' || a.priority === 'high').slice(0, 4).map(a => `
            <div class="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="flex items-center gap-2 mb-3">
                <span class="badge" style="background:${getESGColor(a.category)}15;color:${getESGColor(a.category)}">${a.category}</span>
                <span class="badge" style="background:${getImpactColor(a.priority)}15;color:${getImpactColor(a.priority)}">${a.priority.toUpperCase()}</span>
              </div>
              <p class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">${a.title}</p>
              <p class="text-xs text-gray-500 mb-3">${a.assignedDepartment} · Due: ${a.deadline}</p>
              <div class="progress-bar mb-1">
                <div class="progress-fill" style="width:${a.progress}%;background:${getStatusColor(a.status)}"></div>
              </div>
              <p class="text-[10px] text-gray-400 text-right">${a.progress}% complete</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
