export default [
    {
        path: '/openplatform',
        name: 'openplatform',
        icon: 'CloudServerOutlined',
        access: 'checkPermission',
        //redirect: '/openplatform/appEntity',
        routes: [
            {
                name: 'identityclient',
                path: '/openplatform/identityclient',
                component: './openplatform/identityclient',
            },
            { path: '/', redirect: '/openplatform/appEntity' },
            {
                name: 'appEntity',
                path: '/openplatform/appEntity',
                component: './openplatform/app/appEntity',
            },
            {
                name: 'appTable',
                path: '/openplatform/appTable/:appId',
                component: './openplatform/app/appTable',
                hideInMenu: true,
            },
            {
                name: 'appColumn',
                path: '/openplatform/appColumn/:appId/:tableId',
                component: './openplatform/app/appColumn',
                hideInMenu: true
            },
            {
                name: 'appData',
                path: '/openplatform/appData/:appId/:tableId',
                component: './openplatform/app/appData',
                hideInMenu: true
            },
        ]
    }
]