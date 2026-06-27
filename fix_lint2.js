const fs = require('fs');

const fixCreditsBilling = () => {
  const p = 'c:/rehyntrixai/app/credits-billing/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  
  const bad = `  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchBillingData()
  }, [user, initialized])


    fetchBillingData()
  }, [user, initialized])`;

  const good = `  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchBillingData()
  }, [user, initialized, supabaseClient])`;

  if (c.includes(bad)) {
    c = c.replace(bad, good);
    fs.writeFileSync(p, c);
    console.log('fixed credits-billing');
  } else {
    console.log('credits-billing: pattern not found, trying alternate...');
    // Just find and remove the bad nested block
    const lines = c.split('\n');
    const out = [];
    let skip = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('  useEffect(() => {') && 
          i + 1 < lines.length && 
          lines[i+1].includes('if (!initialized)')) {
        skip = true;
        continue;
      }
      if (skip && lines[i].includes('}, [user, initialized])')) {
        skip = false;
        continue;
      }
      if (skip) continue;
      out.push(lines[i]);
    }
    fs.writeFileSync(p, out.join('\n'));
    console.log('fixed credits-billing (line-based)');
  }
};

const fixSettings = () => {
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  
  const bad = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])
  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])

  async function loadSettings()`;

  const good = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])

  async function loadSettings()`;

  if (c.includes(bad)) {
    c = c.replace(bad, good);
    fs.writeFileSync(p, c);
    console.log('fixed settings');
  } else {
    console.log('settings: pattern not found');
  }
};

fixCreditsBilling();
fixSettings();
