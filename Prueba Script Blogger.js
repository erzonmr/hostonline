// scripts.js
const apiKey = 'AIzaSyBMy4Okn4d_HInbEPZRuoMGlc8BChDHyhY';
        const blogId = '1102384371196845929';
        const label = 'Abel Zavala';

        async function fetchPosts() {
            const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&labels=${label}`);
            const data = await response.json();
            return data.items;
        }

        function generateLinks(posts, listId) {
            const postList = document.getElementById(listId);
            posts.forEach(post => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = post.url;
                link.textContent = post.title;
                listItem.appendChild(link);
                postList.appendChild(listItem);
            });
        }

        async function init() {
            let posts = await fetchPosts();
            if (posts) {
                // Obtener las 10 entradas más vistas
                let topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 10);
                generateLinks(topPosts, 'top-posts');

                // Ordenar todas las entradas alfabéticamente por título
                let allPosts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
                generateLinks(allPosts, 'all-posts');
            }
        }

        window.onload = init;