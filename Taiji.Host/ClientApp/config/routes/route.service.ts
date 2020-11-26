export default [{
    path: '/service',
    layout: false,
    routes: [
        {
            name: 'servicestore',
            path: '/service/',
            component: './service/list',
            access: 'anonymous'
        },
        {
            name: 'register',
            path: '/service/servicestore',
            component: './service/servicestore',
            access: 'anonymous',
        },
    ],
}]