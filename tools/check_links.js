const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'public');
const pagesDir = path.join(root, 'pages');
function listHtmlFiles(dir){
  return fs.readdirSync(dir).filter(f=>f.endsWith('.html')).map(f=>path.join(dir,f));
}
const htmlFiles = [...listHtmlFiles(root), ...listHtmlFiles(pagesDir)];
let missing = [];
htmlFiles.forEach(file=>{
  const txt = fs.readFileSync(file,'utf8');
  const regex = /<script[^>]*src=["']([^"']+)["']/g;
  let m;
  while((m = regex.exec(txt))){
    const src = m[1];
    if(src.startsWith('http')) continue;
    let resolved;
    if(src.startsWith('/')){
      resolved = path.join(root, src.replace(/^\//,''));
    } else if(src.startsWith('../')){
      resolved = path.resolve(path.dirname(file), src);
    } else {
      resolved = path.resolve(path.dirname(file), src);
    }
    if(!fs.existsSync(resolved)) missing.push({file, src, resolved});
  }
  // check local stylesheet links
  const cssRegex = /<link[^>]*href=[\"']([^\"']+)[\"']/g;
  while((m = cssRegex.exec(txt))){
    const href = m[1];
    if(href.startsWith('http') || href.startsWith('https')) continue;
    let resolved;
    if(href.startsWith('/')){
      resolved = path.join(root, href.replace(/^\//,''));
    } else if(href.startsWith('../')){
      resolved = path.resolve(path.dirname(file), href);
    } else {
      resolved = path.resolve(path.dirname(file), href);
    }
    if(!fs.existsSync(resolved)) missing.push({file, src: href, resolved});
  }
});
if(missing.length===0){
  console.log('No missing script files found');
  process.exit(0);
}
console.log('Missing script files:');
missing.forEach(m=>{
  console.log(`${m.file} -> ${m.src} (checked ${m.resolved})`);
});
process.exit(1);
