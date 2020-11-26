export default [
    {
        path: '/userInfo',
        name: 'userInfo',
        icon: 'InfoCircleOutlined',
        access: 'checkPermission',
        routes: [
            {
                name: 'info',
                path: '/userInfo/info',
                component: './userInfo/info',

            },
            {
                name: 'changepwd',
                path: '/userInfo/changepwd',
                component: './userInfo/changepwd', 
            },
        ]
    }
]