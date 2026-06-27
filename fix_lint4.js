const fs = require('fs');

{
  const p = 'c:/rehyntrixai/app/credits-billing/page.tsx';
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  
  // Find and fix lines 43-46
  const out = [];
  let i = 0;
  while (i < lines.length) {
    // Skip empty lines 43-44 (0-indexed 42-43)
    if (i === 42 || i === 43) {
      i++;
      continue;
    }
    // Line 45: replace orphaned fetchBillingData() with useEffect
    if (lines[i].trim() === 'fetchBillingData()') {
      out.push('  useEffect(() => {');
      out.push('    if (!initialized) return');
      out.push('    if (!user) {');
      out.push("      router.push('/auth/login')");
      out.push('      return');
      out.push('    }');
      out.push('    fetchBillingData()');
      out.push('  }, [user, initialized])');
      i++;
      continue;
    }
    // Line 46: orphaned `}, [user, initialized])` - skip
    if (lines[i].trim() === '}, [user, initialized])') {
      i++;
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log('credits-billing fixed');
}

{
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  
  const out = [];
  let i = 0;
  let seenFirst = false;
  while (i < lines.length) {
    if (lines[i].includes("if (!user) { router.push('/auth/login'); return }") &&
        lines[i+1] && lines[i+1].includes('loadSettings()') &&
        !seenFirst) {
      seenFirst = true;
      out.push(lines[i]);
      i += 3; // skip: current line + loadSettings() + }, [user, router])
      // Now skip the duplicate blocks
      while (i < lines.length && lines[i].includes("if (!user) { router.push('/auth/login'); return }")) {
        i += 3;
      }
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log('settings fixed');
}
