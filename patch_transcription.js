const fs = require('fs');
const path = 'client/src/pages/TranscriptionPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove import { Download, Upload } from 'lucide-react'
content = content.replace("import { Download, Upload } from 'lucide-react'\n", "");

// Remove handleExport and handleImport
content = content.replace(/const handleExport = useCallback\(\(\) => \{[\s\S]*?\}, \[\]\)\n/, "");
content = content.replace(/const handleImport = useCallback\(\(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\}, \[\]\)\n/, "");

// Remove fileInputRef
content = content.replace("  const fileInputRef = useRef<HTMLInputElement>(null)\n\n", "");
content = content.replace("  const fileInputRef = useRef<HTMLInputElement>(null)\n", "");
content = content.replace("import { useState, useCallback, useRef } from 'react'", "import { useState, useCallback } from 'react'");

// Remove the Data Backup and Footer UI
content = content.replace(/\{?\/\*\s*── Data Backup \(Export\/Import\) ──\s*\*\/\}?[\s\S]*?\{?\/\*\s*── Footer ──\s*\*\/\}?[\s\S]*?<\/p>/, "");

fs.writeFileSync(path, content, 'utf8');
