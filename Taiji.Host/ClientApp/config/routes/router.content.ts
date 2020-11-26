export default [{
    path: '/content',
    name: 'content',
    icon: 'BookOutlined',
    access: 'canAdmin',
    routes: [
        {
            name: 'category',
            path: '/content/category',
            component: './content/category',

        },
        {
            name: 'article',
            path: '/content/article',
            component: './content/article',
        },
    ]
}]