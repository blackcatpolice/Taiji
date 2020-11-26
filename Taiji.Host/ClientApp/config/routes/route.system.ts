export default [{
    name:"system",
    path:'/system',
    assess:'canAdmin',
    icon:'SettingOutlined',
    access: 'canAdmin',
    routes:[
        {
            name:'fileBase',
            path:'/system/fileBase',
            component:'./system/fileBase/index.tsx' 
        }
    ]
}]