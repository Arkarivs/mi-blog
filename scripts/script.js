const repost = document.getElementById("ark");
async function publicaciones() {
    try {
        const respuesta = await fetch(`https://arkarivs.github.io/mi-blog/mango/index.json`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if(!respuesta.ok) {
            throw new Error('HTTP Error ' + respuesta.status);
        }
        return await respuesta.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

publicaciones().then(publicaciones => {
    if(!publicaciones || !Array.isArray(publicaciones) || publicaciones.length === 0) {
        repost.innerHTML = "<p>no post</p>";
        return;
    }

    const limit = publicaciones.slice(0, 3);

    repost.innerHTML += limit.map(post => {
        const url = post.url || ('/mango/' + post.id || '');
        const sano = escapeHtml(post.title);
        return `
        <br>
        <a href="/mi-blog${url}" style="color: white;">
            <div id="miid" class="miclass" style="border: 2px solid green; border-radius: 13px;">
                <div style="position: relative;">
                    <p style="cursor: default; postion: relative; left: 12px; padding: 8px;">${sano}</p>
                </div>    
            </div>
        </a>
        `;
    }).join('\n');
})

// small helper to avoid XSS when inserting strings
function escapeHtml(str) {
return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}