const fs = require('fs');

// Fix credits-billing - lines 43-46 are broken
{
  const p = 'c:/rehyntrixai/app/credits-billing/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  
  // Find and replace the broken block after "const [activeTab..."
  const broken = `  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'history'>('overview')


\n\n    fetchBillingData()
  }, [user, initialized])`;

  const fixed = `  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'history'>('overview')

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchBillingData()
  }, [user, initialized])`;
  
  if (c.includes(broken)) {
    c = c.replace(broken, fixed);
    console.log('credits-billing: fixed exact match');
  } else {
    // Just replace by finding the residual broken lines
    c = c.replace(
      /\n\n    fetchBillingData\(\)\n  \}, \[user, initialized\]\)/,
      '\n  useEffect(() => {\n    if (!initialized) return\n    if (!user) {\n      router.push(\'/auth/login\')\n      return\n    }\n    fetchBillingData()\n  }, [user, initialized])'
    );
    console.log('credits-billing: fixed residual');
  }
  fs.writeFileSync(p, c);
}

// Fix settings - remove duplicate useEffect
{
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  
  // Remove duplicate useEffect block
  const dup1 = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])
  useEffect(() => {`;
  
  if (c.includes(dup1)) {
    c = c.replace(dup1, `  useEffect(() => {`);
    console.log('settings: removed duplicate');
  } else {
    // Alternate pattern
    const dup2 = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])
  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])`;
    
    const fix2 = `  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    loadSettings()
  }, [user, router])`;
    
    if (c.includes(dup2)) {
      c = c.replace(dup2, fix2);
      console.log('settings: removed duplicate (full)');
    }
  }
  fs.writeFileSync(p, c);
}

console.log('done');
