const fs = require('fs');

const fixCreditsBilling = () => {
  const p = 'c:/rehyntrixai/app/credits-billing/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    /  useEffect\(\) \{\n    if \(!initialized\) return\n    if \(!user\) \{\n      router\.push\('\/auth\/login'\)\n      return\n    \}\n  useEffect\(\) \{\n    if \(!initialized\) return\n    if \(!user\) \{\n      router\.push\('\/auth\/login'\)\n      return\n    \}\n    fetchBillingData\(\)\n  \}, \[user, initialized\]\)\n\n\n    fetchBillingData\(\)\n  \}, \[user, initialized\]\)/,
    `  useEffect(() => {\n    if (!initialized) return\n    if (!user) {\n      router.push('/auth/login')\n      return\n    }\n    fetchBillingData()\n  }, [user, initialized, supabaseClient])`
  );
  fs.writeFileSync(p, c);
  console.log('fixed credits-billing');
};

const fixSettings = () => {
  const p = 'c:/rehyntrixai/app/settings/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    /  useEffect\(\) \{\n    if \(!user\) \{ router\.push\('\/auth\/login'\); return \}\n    loadSettings\(\)\n  \}, \[user, router\]\)\n  useEffect\(\) \{\n    if \(!user\) \{ router\.push\('\/auth\/login'\); return \}\n    loadSettings\(\)\n  \}, \[user, router\]\)\n\n\n/,
    `  useEffect(() => {\n    if (!user) { router.push('/auth/login'); return }\n    loadSettings()\n  }, [user, router])\n\n`
  );
  fs.writeFileSync(p, c);
  console.log('fixed settings');
};

fixCreditsBilling();
fixSettings();
