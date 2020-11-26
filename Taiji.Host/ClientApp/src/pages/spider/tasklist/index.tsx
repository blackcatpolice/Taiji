import React, { useState, useRef } from 'react'

import { Button, Divider, Image } from 'antd';
import { Link } from 'umi';

import { PlusOutlined } from '@ant-design/icons';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { SpiderTaskClient } from '@/apis/API';

const taskList: React.FC<{}> = (props: any) => {
    const [dataSource, setDatasource] = useState<[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});
 
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
                    <Divider type="vertical" />
                    <Link to={"/spider/tasklist/tasitem" + record.id }>编辑数据</Link>
                    
                    {/* <Divider type="vertical" />
                    <a onClick={async () => {
                        await handleDeleteCategory(record)
                        actionRef.current.reload();
                    }}>删除</a> */}
                </>
            ),
        },
    ]

    var spiderTaskClient = new SpiderTaskClient();

     
    const handleDeleteCategory = async (data: any) => {
        //await spiderTaskClient.delete(data.id)
    }

    return (
        <PageContainer>
            <ProTable<any>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                dataSource={dataSource}
                toolBarRender={() => [
                     
                ]}
                request={async (params, sorter, filter) => {
                    var res = await spiderTaskClient.taskList(params.current ?? 0, params.pageSize)
                    console.log(res)
                    const data: RequestData<any> = { success: true, data: res.data, total: res.count, key: ['id'] };
                    return data;
                }}
            >
            </ProTable> 
        </PageContainer >
    )
}

export default taskList;