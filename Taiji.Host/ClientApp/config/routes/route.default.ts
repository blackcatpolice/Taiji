export default [{
    path: '/user',
    layout: false,
    routes: [
        {
            name: 'login',
            path: '/user/login',
            component: './user/login',
            access: 'anonymous'
        },
        {
            name: 'register',
            path: '/user/register',
            component: './user/register',
            access: 'anonymous',
        },
    ],
},
{
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
},]