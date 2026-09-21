const fs = require('fs');
const path = 'client/src/pages/HistoryPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { ArrowLeft, Trash2, Filter, ChevronDown, Palette, X } from 'lucide-react'",
  "import { ArrowLeft, Trash2, Filter, ChevronDown, Palette, X, Calendar, CreditCard, User } from 'lucide-react'"
);

fs.writeFileSync(path, content, 'utf8');
