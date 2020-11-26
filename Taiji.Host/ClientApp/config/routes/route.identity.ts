export default [
    {
        path: '/identity',
        name: 'identity',
        icon: 'SecurityScanOutlined',
        access: 'canAdmin',
        routes: [
            {
                path: '/identity/role',
                name: 'role',
                icon: 'smile',
                component: './identity/role'
            },{
                path: '/identity/user',
                name: 'user',
                icon: 'smile',
                component: './identity/user'
            },
            {
                path: '/identity/permission',
                name: 'permission',
                icon: 'smile',
                component: './identity/permission'
            },
        ],
    },
]