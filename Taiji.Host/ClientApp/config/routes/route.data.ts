export default [
    {
        path: '/data',
        name: 'data',
        icon: 'CloudServerOutlined',
        access: 'checkPermission',
        routes: [  
            {
                name:'appEntity',
                path:'/openplatform/appEntity',
                component:'./openplatform/app/appEntity',
            },
            {
                name:'appTable',
                path:'/openplatform/appTable/:appId',
                component:'./openplatform/app/appTable',
                hideInMenu: true
            },
            {
                name:'appColumn',
                path:'/openplatform/appColumn/:appId/:tableId',
                component:'./openplatform/app/appColumn',
                hideInMenu: true
            },
            {
                name:'appData',
                path:'/openplatform/appData/:appId/:tableId',
                component:'./openplatform/app/appData',
                hideInMenu: true
            },
        ]
    }
]