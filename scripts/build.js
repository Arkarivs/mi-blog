const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { title } = require('process');

const POSTS_DIR = path.join(process.cwd(), 'mango');
const OUT_FILE = path.join(POSTS_DIR, 'index.json');

function taurina(s) {
    return String(s).replace(/-+/g, ' ').trim();
}

function eyes(){
    if(!fs.existsSync(POSTS_DIR)) return [];

    const files = fs.readdirSync(POSTS_DIR).filter(f => /\.(md|markdown|html)$/i.test(f));

    const posts = files.map(filename => {
        const full = path.join(POSTS_DIR, filename);

        let raw;
        try {
            raw = fs.readFileSync(full, 'utf8');
        } catch (err) {
            console.error(`failed to read ${filename}: ${err.message}`);
            return null;
        }

        let meta = {};
        let excerpt = '';
        let tags = {};

        if(/^\s*---/.test(raw)) {
            try {
                const parsed = matter(raw);
                meta = parsed.data || {};
                excerpt = (parsed.content || '').split('\n').find(l => l.trim()) || '';
            } catch (err) {
                console.error(`failed to parse ${filename}: ${err.message} `);
            }
            
        } else (
            excerpt = raw.split('\n').find(l => l.trim()) || ''
        )

        const slug = filename.replace(/\.(md|markdown|html)$/i, '');
        const url = `/mango/${slug}`;

        return {
            id: meta.id || slug,
            title: taurina(meta.title || slug),
            date: meta.date || new Date(),
            tags: Array.isArray(meta.tags) ? meta.tags: (meta.tags ? [meta.tags] : []),
            url
        };
    }).filter(Boolean);

    posts.sort((a,b) => a.id.localCompare(b.id));

    return posts;
}

function myst(){
    if(!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function pen(posts){
    myst();
    try {
        fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
        console.log(`${OUT_FILE} (${posts.length} items)`);
    } catch (err) {
        console.error(`error: ${err.message}`);
        process.exit(1);
    }
}

function ark(){
    try {
        const posts = eyes();
        pen(posts);
    } catch (err) {
        console.error(`error: ${err.message}`);
        process.exit(1);
    }
}

ark();