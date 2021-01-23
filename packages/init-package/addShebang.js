const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, './dist', 'exec.bundle.js');

const index = fs.readFileSync(indexPath, 'utf-8');

const out = `#!/usr/bin/env node\n${index}`;

fs.writeFileSync(indexPath, out);
