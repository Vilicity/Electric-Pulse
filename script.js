// [EXISTING ElectricPulse Dashboard JavaScript goes here - retained]
// ...

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
