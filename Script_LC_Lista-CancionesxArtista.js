async function fetchPosts(blogId, label) {
    const response = await fetch(`https://www.blogger.com/feeds/${blogId}/posts/default/-/${label}?alt=json`);
    const data = await response.json();
    return data.feed.entry;
}

function generateLinks(posts, listId) {
    const postList = document.getElementById(listId);
    posts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = post.link.find(l => l.rel === 'alternate').href;
        link.textContent = post.title.$t;
        listItem.appendChild(link);
        postList.appendChild(listItem);
    });
}

async function init() {
    const blogId = document.body.getAttribute('data-blog-id');
    const label = document.body.getAttribute('data-label');

    if (blogId && label) {
        let posts = await fetchPosts(blogId, label);
        if (posts) {
            // Obtener las 10 entradas más recientes
            let topPosts = posts.slice(0, 10);
            generateLinks(topPosts, 'top-posts');

            // Ordenar todas las entradas alfabéticamente por título
            let allPosts = posts.sort((a, b) => a.title.$t.localeCompare(b.title.$t));
            generateLinks(allPosts, 'all-posts');
        }
    } else {
        console.error('Blog ID and label must be provided.');
    }
}

window.onload = init;
