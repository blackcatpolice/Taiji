import React, { useState, useRef } from 'react'
import { Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
 
import IdentityClientCreateForm from './components/CreateForm'
import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { IdentityClient, IdentityClientClient } from '@/apis/API';



const openPlatform: React.FC<{}> = ({ }) => {
    const [dataSource, setDatasource] = useState<IdentityClient[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});

    const actionRef = useRef<ActionType>();
    const columns: ProColumns<IdentityClient>[] = [
        {
            title: '客户端名',
            dataIndex: 'clientName',
        }
        ,
        {
            title: 'AppKey',
            dataIndex: 'clientId'
        },
        {
            title: 'AppSecrety',
            dataIndex: 'clientSecret'
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={async () => {
                            await getIdentityClientAddOrUpdate(record.clientName)
                            handleUpdateFormVisible(true);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={async () => {
                        await handleDeleteIdentityClient(record)
                        actionRef.current.reload();
                    }}>删除</a>
                </>
            ),
        },
    ]

    var identityClientClient = new IdentityClientClient();

    const handleCreateIdentityClient = async (data: any) => {
        return await identityClientClient.postAddOrUpdate(data)
    }
    const getIdentityClientAddOrUpdate = async (id?: any) => {
        const res = await identityClientClient.getAddOrUpdate(id)
        handleUpdateFormData({ data: res.data.modelData, modelType: res.data.modelType })
    }
    const handleDeleteIdentityClient = async (data: any) => {
        await identityClientClient.delete(data.clientName)
    }

    return (
        <PageContainer>
            <ProTable<IdentityClient>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                dataSource={dataSource}
                toolBarRender={() => [
                    <Button type="primary" onClick={async () => {
                        await getIdentityClientAddOrUpdate()
                        handleCreateFormVisible(true)
                    }}><PlusOutlined />新建</Button>
                ]}
                request={async (params, sorter, filter) => {
                    var res = await identityClientClient.list(params.current, params.pageSize)
                    const data: RequestData<IdentityClient> = { success: true, data: res.data, total: res.count, key: ['id'] };
                    return data;
                }}
            >
            </ProTable>
            {creatFormVisible && (
                <IdentityClientCreateForm onSubmit={async (data) => { 
                    await handleCreateIdentityClient(data)
                    handleCreateFormVisible(false);
                        actionRef.current.reload();
                    }}
                    onCancel={() => {
                        handleCreateFormVisible(false);
                        handleUpdateFormData({});
                        actionRef.current.reload();
                    }}
                     
                    formModelVisible={creatFormVisible}>

                </IdentityClientCreateForm>)}
            {updateFormVisible && (
                <IdentityClientCreateForm onSubmit={async(data) => { 
                   await handleCreateIdentityClient(data)
                   handleUpdateFormVisible(false);
                   actionRef.current.reload();
                }}
                    onCancel={() => {
                        handleUpdateFormVisible(false);
                        handleUpdateFormData({});
                        actionRef.current.reload();
                    }} 
                    formModelVisible={updateFormVisible}>

                </IdentityClientCreateForm>
            )}
        </PageContainer >
    )
}

export default openPlatform;