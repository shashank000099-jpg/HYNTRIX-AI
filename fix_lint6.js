const fs = require('fs');

{
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  const c = fs.readFileSync(p, 'utf8');
  
  // Replace the broken nested useEffect blocks with a single correct one
  const broken = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()


  async function loadSettings()`;

  const fixed = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])

  async function loadSettings()`;

  if (c.includes(broken)) {
    const c2 = c.replace(broken, fixed);
    fs.writeFileSync(p, c2);
    console.log('settings: exact fix applied');
  } else {
    console.log('settings: exact pattern not found');
    // Try line-based fix
    const lines = c.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i] === '  useEffect(() => {' &&
          lines[i+1] && lines[i+1].includes("if (!user) { router.push('/auth/login'); return }") &&
          lines[i+2] && lines[i+2] === '  useEffect(() => {') &&
          lines[i+3] && lines[i+3].includes("if (!user) { router.push('/auth/login'); return }") &&
          lines[i+4] && lines[i+4].includes('loadSettings()')) {
        // Skip first broken useEffect
        i += 2;
        // Keep second useEffect block but fix it
        out.push('  useEffect(() => {');
        out.push("    if (!user) { router.push('/auth/login'); return }");
        out.push('    loadSettings()');
        out.push('  }, [user, router])');
        i += 3; // skip loadSettings(), blank lines, and function declaration line
        // Skip blank lines
        while (i < lines.length && lines[i].trim() === '') i++;
        continue;
      }
      out.push(lines[i]);
      i++;
    }
    fs.writeFileSync(p, out.join('\n'));
    console.log('settings: line-based fix applied');
  }
}
