import React, { useState, useRef } from 'react'

import { Button, Divider, Image } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { SpiderConfig, SpiderConfigClient, SpiderTaskClient } from '@/apis/API';

const spiderConfig: React.FC<{}> = (props: any) => {
    const [dataSource, setDatasource] = useState<[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});

    var appId = props.match.params.appId
    var tableId = props.match.params.tableId
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<any>[] = [
        {
            title: 'configModelJson',
            dataIndex: 'configModelJson',

        },
        {
            width: "150px",
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={async () => {
                            console.log(record)
                            await getCategoryAddOrUpdate(record.id)
                            handleUpdateFormVisible(true);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={async () => {
                            console.log(record)
                            var spiderTaskClient = new SpiderTaskClient(); 
                            await  spiderTaskClient.startTask("default",record.id);
                        }}
                    >
                        启动
                    </a>
                    <Divider type="vertical" />
                    <a onClick={async () => {
                        await handleDeleteCategory(record)
                        actionRef.current.reload();
                    }}>删除</a>
                </>
            ),
        },
    ]

    var spiderConfigClient = new SpiderConfigClient();

    const handleCreateCategory = async (data: any) => {
        return await spiderConfigClient.postAddOrUpdate(data)
    }
    const getCategoryAddOrUpdate = async (id?: any) => {
        const res = await spiderConfigClient.getAddOrUpdate(id)
        console.log(res)
        handleUpdateFormData({ data: res?.data.modelData, modelType: res?.data.modelType })
    }
    const handleDeleteCategory = async (data: any) => {
        await spiderConfigClient.delete(data.id)
    }

    return (
        <PageContainer>
            <ProTable<any>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                dataSource={dataSource}
                toolBarRender={() => [
                    <Button type="primary" onClick={async () => {
                        await getCategoryAddOrUpdate()
                        handleCreateFormVisible(true)
                    }}><PlusOutlined />新建</Button>
                ]}
                request={async (params, sorter, filter) => {
                    var res = await spiderConfigClient.list(params.current ?? 0, params.pageSize)
                    console.log(res)
                    const data: RequestData<any> = { success: true, data: res.data, total: res.count, key: ['id'] };
                    return data;
                }}
            >
            </ProTable>
            {creatFormVisible && (
                <DynamicForm onSubmit={async (data) => {
                    console.log(data)
                    await handleCreateCategory(data)
                    handleCreateFormVisible(false);
                    actionRef.current.reload();
                }}
                    onCancel={() => {
                        handleCreateFormVisible(false);
                        handleUpdateFormData({});
                        actionRef.current.reload();
                    }}
                    data={udpateFormData?.data}
                    longIdKey='LongParentId'
                    modelTypes={udpateFormData?.modelType || []}
                    formModelVisible={creatFormVisible}>

                </DynamicForm>)}
            {updateFormVisible && (
                <DynamicForm onSubmit={async (data) => {
                    await handleCreateCategory(data)
                    handleUpdateFormVisible(false);
                    actionRef.current.reload();
                }}
                    onCancel={() => {
                        handleUpdateFormVisible(false);
                        handleUpdateFormData({});
                        actionRef.current.reload();
                    }}
                    data={udpateFormData?.data}
                    modelData={udpateFormData?.data}
                    longIdKey='LongParentId'
                    modelTypes={udpateFormData?.modelType || []}
                    formModelVisible={updateFormVisible}>

                </DynamicForm>
            )}
        </PageContainer >
    )
}

export default spiderConfig;