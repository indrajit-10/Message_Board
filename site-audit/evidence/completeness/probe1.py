from fetch import get
B='https://blog.123greetings.com'
urls=[B+'/wp-json/wp/v2/users', B+'/?author=1', B+'/xmlrpc.php', B+'/xmlrpc.php?rsd', B+'/wp-login.php', B+'/readme.html', B+'/license.txt',
 B+'/.well-known/security.txt', B+'/ads.txt', 'https://www.123greetings.com/ads.txt', B+'/feed/', B+'/comments/feed/', B+'/wp-json/wp/v2/comments?per_page=100',
 B+'/wp-json/', B+'/robots.txt']
for u in urls:
    ar = False if ('author=' in u or 'wp-login' in u) else True
    d=get(u, allow_redirects=ar)
    h=d['headers']
    print('==',u,d['status'],d['final'] if d['final']!=u else '',d['hist'],d['ct'],d['len'],'loc=',h.get('Location') or h.get('location'),'total=',h.get('X-WP-Total') or h.get('x-wp-total'))
    print('   ', (d['text'] or '')[:300].replace('\n',' | '))
