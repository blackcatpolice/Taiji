import React, { useState, useRef } from 'react'
import { Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';

import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { OryxRoleEntity, RoleClient } from '@/apis/API';



const category: React.FC<{}> = ({ }) => {
    const [dataSource, setDatasource] = useState<OryxRoleEntity[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});

    const actionRef = useRef<ActionType>();
    const columns: ProColumns<OryxRoleEntity>[] = [
        {
            title: '类名',
            dataIndex: 'name',
        }
        ,
        {
            title: '描述',
            dataIndex: 'description'
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={async () => {
                            await getCategoryAddOrUpdate(record.id)
                            handleUpdateFormVisible(true);
                        }}
                    >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={async () => {
                        await handleDeleteCategory(record)
                    }}>删除</a>
                </>
            ),
        },
    ]

    var roleClient = new RoleClient();

    const handleCreateCategory = async (data: any) => {
        return await roleClient.postAddOrUpdate(data)
    }
    const getCategoryAddOrUpdate = async (id?: any) => {
        const res = await roleClient.getAddOrUpdate(id)
        handleUpdateFormData({ data: res.data.modelData, modelType: res.data.modelType })
    }
    const handleDeleteCategory = async (data: any) => {
        await roleClient.delete(data.id)
    }

    return (
        <PageContainer>
            <ProTable<OryxRoleEntity>
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
                    var res = await roleClient.list(params.current, params.pageSize)
                    const data: RequestData<OryxRoleEntity> = { success: true, data: res.data, total: res.count, key: ['id'] };
                    return data;
                }}
            >
            </ProTable>
            {creatFormVisible && (
                <DynamicForm onSubmit={(data) => { 
                        console.log(data)
                    }}
                    onCancel={() => {
                        handleCreateFormVisible(false);
                        handleUpdateFormData({});
                    }}
                    data={udpateFormData?.data}
                    longIdKey='LongParentId'
                    modelTypes={udpateFormData?.modelType || []}
                    formModelVisible={creatFormVisible}>

                </DynamicForm>)}
            {updateFormVisible && (
                <DynamicForm onSubmit={() => { }}
                    onCancel={() => {
                        handleUpdateFormVisible(false);
                        handleUpdateFormData({});
                    }}
                    data={udpateFormData?.data}
                    longIdKey='LongParentId'
                    modelTypes={udpateFormData?.modelType || []}
                    formModelVisible={updateFormVisible}>

                </DynamicForm>
            )}
        </PageContainer >
    )
}

export default category;