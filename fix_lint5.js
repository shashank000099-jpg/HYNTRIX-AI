const fs = require('fs');

{
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  
  const out = [];
  let i = 0;
  while (i < lines.length) {
    // Detect a useEffect block that starts with "if (!user) { router.push('/auth/login'); return }"
    if (lines[i].includes("if (!user) { router.push('/auth/login'); return }") &&
        lines[i+1] && lines[i+1].includes('loadSettings()')) {
      // Keep only the first occurrence, skip duplicates
      let skip = false;
      // Check if we already added a loadSettings() use effect in out
      const alreadyHas = out.some(line => line.includes("loadSettings()"));
      if (alreadyHas) {
        skip = true;
      }
      
      if (!skip) {
        out.push(lines[i]);     // if (!user)...
        out.push(lines[i+1]);   // loadSettings()
        i += 3; // skip } , [user, router])
        continue;
      } else {
        // Skip this duplicate block
        i += 3;
        // Also skip any extra blank lines after duplicates
        while (i < lines.length && lines[i].trim() === '') {
          i++;
        }
        continue;
      }
    }
    out.push(lines[i]);
    i++;
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log('settings fixed');
}
