const fs = require('fs');

{
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  const c = fs.readFileSync(p, 'utf8');

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
    fs.writeFileSync(p, c.replace(broken, fixed));
    console.log('settings: exact fix applied');
    return;
  }

  const lines = c.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const isFirst = lines[i].trim() === "useEffect(() => {" &&
      lines[i+1] && lines[i+1].includes("if (!user) { router.push('/auth/login'); return }");
    const isSecond = isFirst &&
      lines[i+2] && lines[i+2].trim().startsWith("useEffect(() => {") &&
      lines[i+3] && lines[i+3].includes("if (!user) { router.push('/auth/login'); return }") &&
      lines[i+4] && lines[i+4].includes('loadSettings()');

    if (isSecond) {
      out.push('  useEffect(() => {');
      out.push("    if (!user) { router.push('/auth/login'); return }");
      out.push('    loadSettings()');
      out.push('  }, [user, router])');
      i = i + 5;
      while (i < lines.length && lines[i].trim() === '') i++;
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log('settings: line-based fix applied');
}
