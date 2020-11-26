import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { PageContainer, } from '@ant-design/pro-layout';
import FileEditor from '@/components/FileEditor/FileEditor'
import { Template, TemplateManagerClient } from '@/apis/API';

const { Header, Footer, Sider, Content } = Layout;

var templateClient = new TemplateManagerClient();

const fileEditor: React.FC<{}> = (props: any) => {
    var fileName = props.match.params.filename

    const [treeData, setTreeData] = useState<any>([])

    useEffect(() => {
        const getTreeData = async () => {
            var result = await templateClient.getTemplateFileList(fileName)
            var treeData = Object.keys(result).map(key => {
                return { title: key, key: key, isLeaf: true }
            }) ?? []
            let parent = [{
                title: 'default',
                key: 'default',
                children: treeData
            }];

            console.log(parent)
            setTreeData(parent);
        }
        getTreeData()
    }, [])

    //var treeData = 
    return (<PageContainer>
        <FileEditor treeData={treeData}
            onOpenfile={async (fileName) => {
                var content = await templateClient.getTemplateFileContent(fileName)
                return content;
            }}
            onSubmit={async (targetFileName, content) => {
                var b = new Blob([content]);
                await templateClient.saveTemplateFileContent(targetFileName, { data: b, fileName: targetFileName })
            }}>

        </FileEditor>
    </PageContainer>)
}

export default fileEditor;