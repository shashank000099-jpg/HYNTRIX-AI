const fs = require('fs');

{
  const p = 'c:/rehyntrixai/app/auth/login/page.tsx';
  const c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');

  const out = [];
  let i = 0;
  while (i < lines.length) {
    const isSuccessMsg = lines[i].includes("const [successMessage, setSuccessMessage] = useState('')");
    const isUseEffect = lines[i].trim() === "useEffect(() => {" &&
      lines[i+1] && lines[i+1].includes("searchParams.get('verified')") &&
      lines[i+2] && lines[i+2].includes("setSuccessMessage('Account created");

    if (isSuccessMsg) {
      out.push("  const [successMessage, setSuccessMessage] = useState(() => {");
      out.push("    if (searchParams.get('verified') === 'check-email') {");
      out.push("      return 'Account created! Check your email for the verification link, then sign in.'");
      out.push("    }");
      out.push("    if (searchParams.get('message')) {");
      out.push("      return searchParams.get('message')!");
      out.push("    }");
      out.push("    return ''");
      out.push("  })");
      i++;
      continue;
    }

    if (isUseEffect) {
      // Skip until the closing }, [searchParams])
      while (i < lines.length && !lines[i].includes('}, [searchParams])')) {
        i++;
      }
      i++; // skip the closing line
      continue;
    }

    out.push(lines[i]);
    i++;
  }
  fs.writeFileSync(p, out.join('\n'));
  console.log('login fixed');
}
