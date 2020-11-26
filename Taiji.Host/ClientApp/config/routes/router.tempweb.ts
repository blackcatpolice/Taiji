export default [{
    path: '/tempweb',
    name: 'tempweb',
    icon: 'FolderOutlined',
    access: 'canAdmin',
    routes: [
        {
            name: 'route',
            path: '/tempweb/route',
            component: './tempweb/route',

        },
        {
            name: 'page',
            path: '/tempweb/page',
            component: './tempweb/page',
        },
        {
            name: 'tempfiles',
            path: '/tempweb/tempfiles',
            component: './tempweb/tempfiles',
        },
        {
            name: 'tempfileeditor',
            path: '/tempweb/fileeditor/:filename',
            component: './tempweb/tempFiles/fileeditor',
            hideInMenu: true
        },
    ]
}]