// [EXISTING ElectricPulse Dashboard JavaScript goes here - retained]
// ...

// ======= LIVE WAVEFORM Chart.js FAKE DATA INIT & GLOW ======= //
document.addEventListener('DOMContentLoaded', function() {
  // Neon glow config for all
  const CHARTS = [
    {id:'chart-power', min:0, max:2400, base:1100, amp:700},
    {id:'chart-voltage', min:160, max:270, base:220, amp:25},
    {id:'chart-current', min:0, max:20, base:9, amp:7.5},
    {id:'chart-loadscore', min:0, max:100, base:50, amp:22},
    {id:'chart-efficiency', min:0, max:100, base:80, amp:14},
    {id:'chart-jitter', min:0, max:16, base:8, amp:5},
    {id:'chart-packet', min:99, max:100, base:99.85, amp:0.12},
    {id:'chart-temp', min:10, max:60, base:33, amp:12},
    {id:'chart-freq', min:49, max:61, base:54.5, amp:2.6},
  ];
  const makeLabels = () => Array(60).fill('');
  const glowColor = '#22ffff';
  function synth(base, amp, min, max) {
    let v = base + (Math.random()-0.5)*2*amp;
    return Math.max(min, Math.min(max, Math.round(v*100)/100)); 
  }
  if (window.Chart) CHARTS.forEach(({id, min, max, base, amp}) => {
    const el = document.getElementById(id);
    if (!el) return;
    const ctx = el.getContext('2d');
    let points = Array.from({length: 60}, () => synth(base, amp, min, max));
    const chartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: makeLabels(),
        datasets: [{
          data: points,
          borderColor: glowColor,
          borderWidth: 2.3,
          pointRadius: 0,
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          fill: false,
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: {display: false} },
        scales: {
          x: {display: false},
          y: {
            display: false,
            min: min,
            max: max,
          }
        },
        elements: {
          line: {
            borderWidth: 3,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            backgroundColor: glowColor,
            shadowBlur: 22,
            shadowColor: glowColor,
          }
        }
      }
    });
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;
    setInterval(() => {
      points.shift();
      points.push(synth(base, amp, min, max));
      chartObj.data.datasets[0].data = points;
      chartObj.update('none');
    }, 1000);
  });
  // Existing waveform chart code remains
  if (document.getElementById('liveWaveChart')) {
    const ctx = document.getElementById('liveWaveChart').getContext('2d');
    let points = Array.from({length: 60}, () => 200 + Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1));
    function makeLabels() { return Array(60).fill(''); }
    const glowColor = '#22ffff'; // Neon/cyan
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: makeLabels(),
        datasets: [{
          data: points,
          borderColor: glowColor,
          borderWidth: 2.5,
          pointRadius: 0,
          cubicInterpolationMode: 'monotone',
          tension: 0.42,
          fill: false,
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display: false}
        },
        scales: {
          x: {display: false},
          y: {
            display: false,
            min: -400,
            max: 400
          }
        },
        elements: {
          line: {
            borderWidth: 3,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            backgroundColor: glowColor,
            shadowBlur: 22,
            shadowColor: glowColor,
          }
        }
      }
    });

    // NEON GLOW via native canvas (fallback; some browsers ignore Chart.js props above)
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;

    setInterval(() => {
      // Push/pull for fake waveform
      points.shift();
      points.push(200 + Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1));
      myChart.data.datasets[0].data = points;
      myChart.update('none');
    }, 1000);
  }
});

// ========= DASHBOARD SEARCH BAR LOGIC ========= //
document.addEventListener('DOMContentLoaded', function() {
  const SEARCH_MAP = [
    { name: "Dashboard", path: "index.html" },
    { name: "Analytics", path: "analytics.html" },
    { name: "Devices", path: "devices.html" },
    { name: "Live Readings", path: "live-readings.html" },
    { name: "Readings", path: "readings.html" },
    { name: "All Graphs", path: "all-graphs.html" },
    { name: "Reports", path: "reports.html" },
    { name: "Alerts", path: "alerts.html" },
    { name: "Settings", path: "settings.html" },
    { name: "Help", path: "help.html" }
    // Extend this array if you add more dashboard sections or direct functions.
  ];
  const searchInput = document.getElementById('ep-quicksearch');
  const resultsDiv = document.getElementById('ep-quicksearch-results');
  if (searchInput && resultsDiv) {
    searchInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      resultsDiv.innerHTML = '';
      if (!val.length) {
        resultsDiv.classList.remove('active');
        return;
      }
      const matches = SEARCH_MAP.filter(f => f.name.toLowerCase().includes(val));
      if (matches.length > 0) {
        resultsDiv.classList.add('active');
        matches.forEach(m => {
          const link = document.createElement('a');
          link.href = m.path;
          link.innerHTML = m.name.replace(
            new RegExp(`(${val})`, 'ig'),
            '<b>$1</b>'
          );
          resultsDiv.appendChild(link);
        });
      } else {
        resultsDiv.classList.remove('active');
      }
    });
    searchInput.addEventListener('blur', () => {
      setTimeout(() => resultsDiv.classList.remove('active'), 160);
    });
    searchInput.addEventListener('focus', function() {
      if (this.value.trim())
        resultsDiv.classList.add('active');
    });
    searchInput.addEventListener('keydown', function(e) {
      if (!resultsDiv.classList.contains('active')) return;
      const links = Array.from(resultsDiv.querySelectorAll('a'));
      let idx = links.findIndex(l => l === document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx < links.length - 1) links[idx + 1].focus();
        else if (links.length) links[0].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) links[idx - 1].focus();
        else if (links.length) links[links.length - 1].focus();
      }
      if (e.key === 'Enter' && document.activeElement.tagName === 'A') {
        document.activeElement.click();
      }
    });
  }
});
