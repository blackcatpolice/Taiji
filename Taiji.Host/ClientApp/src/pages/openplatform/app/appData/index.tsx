import React, { useState, useRef, useEffect } from 'react'
import { Button, Divider, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';

import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { AppDataPostViewModel, AppDataClient, DataGetVieModel } from '@/apis/API';



const category: React.FC<{}> = (props: any) => {
    const [dataSource, setDatasource] = useState<[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});
    const [columns, setColumns] = useState<ProColumns<any>[]>()

    var appId = props.match.params.appId
    var tableId = props.match.params.tableId
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        initColumn();
    }, [])


    var appDataClient = new AppDataClient();

    const initColumn = async () => {
        var dynamicColumn = await getTableColumn();
        const _columns: any[] = []
        for (const col of dynamicColumn) {
            _columns.push({
                title: col,
                dataIndex: col.split('').map((item: any, i: any) => { return i == 0 ? item.toLowerCase() : item }).join(''),
                responsive: ['md'],
                key: col,
            })
        }
        _columns.reverse()
        const columnDefaul = [
            {
                title: '操作',
                dataIndex: 'option',
                valueType: 'option',
                width: 150,
                render: (_, record) => (
                    <>
                        <a
                            onClick={async () => {
                                await getCategoryAddOrUpdate(record['_id'])
                                handleUpdateFormVisible(true);
                            }}
                        >
                            编辑
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

        var newColumns: any = [];
        newColumns = newColumns.concat(_columns, columnDefaul)
        setColumns(newColumns)
    }

    const getTableColumn = async (): Promise<any> => {
        var res = await appDataClient.listStruct(appId, tableId)
        return res.data
    }

    const handleCreateCategory = async (data: any) => {
        var vm = new AppDataPostViewModel();
        vm.appId = appId,
            vm.appTableId = tableId,
            vm.data = data;
        return await appDataClient.postAddOrUpdate(vm)
    }
    const getCategoryAddOrUpdate = async (id?: any) => {
        const res = await appDataClient.getAddOrUpdate(appId, tableId, id)
        handleUpdateFormData({ data: res?.data.modelData, modelType: res?.data.modelType })
    }
    const handleDeleteCategory = async (data: any) => {
        await appDataClient.delete(appId, tableId, data["_id"])
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
                    var queries = {}
                    for (const key in params) {
                        if (Object.prototype.hasOwnProperty.call(params, key)) {
                            const queryItem = params[key];
                            if (key == "current" || key == "pageSize")
                                continue
                            queries[key] = queryItem
                        }
                    }

                    var dvm = new DataGetVieModel();
                    dvm = { appId: appId, tableName: tableId, query: queries, current: params.current ?? 0, size: params.pageSize ?? 0 }
                    var res = await appDataClient.list(dvm)

                    const data: RequestData<any> = { success: true, data: res.data.item1, total: res.data.item2, key: ['id'] };
                    return data;
                }}
            >
            </ProTable>
            {
                creatFormVisible && (
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

                    </DynamicForm>)
            }
            {
                updateFormVisible && (
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
                )
            }
        </PageContainer >
    )
}

export default category;