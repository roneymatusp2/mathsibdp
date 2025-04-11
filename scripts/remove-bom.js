import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const UTF8_BOM = Buffer.from([0xEF, 0xBB, 0xBF]);
const UTF16LE_BOM = Buffer.from([0xFF, 0xFE]);

// Get the directory name using ES module pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hasBOM(buffer) {
  // Check for UTF-8 BOM
  if (buffer.length >= 3 && 
      buffer[0] === UTF8_BOM[0] && 
      buffer[1] === UTF8_BOM[1] && 
      buffer[2] === UTF8_BOM[2]) {
    return 'UTF-8 BOM';
  }
  
  // Check for UTF-16LE BOM
  if (buffer.length >= 2 &&
      buffer[0] === UTF16LE_BOM[0] &&
      buffer[1] === UTF16LE_BOM[1]) {
    return 'UTF-16LE BOM';
  }
  
  return false;
}

function removeBOM(filePath) {
  try {
    console.log(`Checking file: ${filePath}`);
    const content = fs.readFileSync(filePath);
    
    // Look for BOM or any other non-standard encoding bytes at the start
    const firstFewBytes = content.slice(0, 10);
    console.log(`First few bytes: ${Array.from(firstFewBytes).map(b => b.toString(16)).join(' ')}`);
    
    const bomType = hasBOM(content);
    
    if (bomType === 'UTF-8 BOM') {
      console.log(`🔧 Removing UTF-8 BOM from ${filePath}`);
      const withoutBOM = Buffer.from(content.slice(3));
      fs.writeFileSync(filePath, withoutBOM);
      return true;
    } else if (bomType === 'UTF-16LE BOM') {
      console.log(`🔧 Removing UTF-16LE BOM from ${filePath}`);
      
      // For UTF-16LE, we need to convert the whole file to UTF-8
      // Read the file as UTF-16LE and write it as UTF-8
      const text = content.toString('utf16le').replace(/^\uFEFF/, '');
      fs.writeFileSync(filePath, text, 'utf8');
      
      return true;
    } else if (content[0] !== 0x69 && content[0] !== 0x2f && content[0] !== 0x2f) { 
      // If not starting with 'i' (import), '/' (comment), 'r' (react), etc
      console.log(`⚠️ File ${filePath} doesn't start with expected character but no standard BOM detected. Force fixing...`);
      
      // Find the first occurrence of 'import'
      const importIndex = content.indexOf(Buffer.from('import'));
      if (importIndex > 0) {
        console.log(`Found 'import' at position ${importIndex}, truncating file`);
        const fixedContent = content.slice(importIndex);
        fs.writeFileSync(filePath, fixedContent);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Scan and fix all files in the results directory
const resultsDir = path.join(__dirname, '..', 'src', 'components', 'results');
let fixedFiles = 0;

console.log(`Scanning all files in: ${resultsDir}`);
const files = fs.readdirSync(resultsDir);

for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(resultsDir, file);
    console.log(`\nProcessing: ${file}`);
    
    // Try to fix the file using our standard methods
    if (removeBOM(filePath)) {
      fixedFiles++;
    } else {
      // If standard methods fail, use a more aggressive approach
      console.log(`Using more aggressive approach for ${file}`);
      try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        
        // Look for the first import statement
        const importMatch = content.match(/import\s+.*?from/);
        if (importMatch && importMatch.index > 0) {
          console.log(`Found import at position ${importMatch.index}, trimming file`);
          const newContent = content.substring(importMatch.index);
          fs.writeFileSync(filePath, newContent, 'utf8');
          fixedFiles++;
        }
      } catch (err) {
        console.error(`Failed aggressive approach for ${file}:`, err);
      }
    }
  }
}

if (fixedFiles > 0) {
  console.log(`\n✅ Fixed ${fixedFiles} file(s) with encoding issues.`);
} else {
  console.log('\n❓ No encoding issues detected or fixed.');
} 