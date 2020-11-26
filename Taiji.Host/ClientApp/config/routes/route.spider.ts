export default [
    {
        name: 'spider',
        path: '/spider',
        icon: 'BugOutlined',
        access: 'canAdmin',
        routes: [
            {
                name:'spiderConfig',
                path:'/spider/spiderconfig',
                component: './spider/config'
            },
            {
                name: 'spiderTaskList',
                path: '/spider/tasklist',
                component: './spider/tasklist/index.tsx',
            },
            {
                name: 'spiderTaskItem',
                path: '/spider/tasklist/tasitem:taskId',
                component: './spider/tasklist/tasklogitme.tsx',
                hideInMenu: true
            }
        ]
    }
]