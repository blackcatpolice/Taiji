import React, { useState, useRef, useEffect } from 'react'
import { Button, Divider, Row, Col, Card, Avatar, Pagination, Menu, Dropdown, Tooltip } from 'antd';
import { Link } from 'umi';
import { PlusOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar, PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';

import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { ModelType, ControlType } from '@/components/DynamicForm/DynamicForm.d';

import { AppEntity, AppEntityClient } from '@/apis/API';

const { Meta } = Card

const category: React.FC<{}> = ({ }) => {
    const [dataSource, setDatasource] = useState<AppEntity[]>();
    const [creatFormVisible, handleCreateFormVisible] = useState<boolean>(false);
    const [updateFormVisible, handleUpdateFormVisible] = useState<boolean>(false);
    const [udpateFormData, handleUpdateFormData] = useState<{ data?: any, modelType?: ModelType[] }>({});

    const actionRef = useRef<ActionType>();
    const columns: ProColumns<AppEntity>[] = [
        {
            title: '应用名',
            dataIndex: 'name',
        }
        ,
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
                    <Link to={"/openplatform/appTable/" + record.id}>数据</Link>
                    <Divider type="vertical" />
                    <a onClick={async () => {
                        await handleDeleteCategory(record)
                        //actionRef.current.reload();
                    }}>删除</a>
                </>
            ),
        },
    ]

    const getmenu = (id: any) => {
        return (
            <Menu>
                <Menu.Item >
                    <Link to={"/openplatform/identityclient/" + id}>客户端配置</Link>
                </Menu.Item>
                <Menu.Item danger>删除</Menu.Item>
            </Menu >
        )
    };

    var appEntityClient = new AppEntityClient();

    const getDataList = async () => {
        return await appEntityClient.list(1, 10)
    }

    const handleCreateCategory = async (data: any) => {
        return await appEntityClient.postAddOrUpdate(data)
    }
    const getCategoryAddOrUpdate = async (id?: any) => {
        const res = await appEntityClient.getAddOrUpdate(id)
        handleUpdateFormData({ data: res.data.modelData, modelType: res.data.modelType })
    }
    const handleDeleteCategory = async (data: any) => {
        await appEntityClient.delete(data.id)
    }

    useEffect(() => {
        getDataList().then(res => {
            setDatasource(res.data)
        })
    }, [])

    return (<PageContainer >
        <Card style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={async () => {
                await getCategoryAddOrUpdate()
                handleCreateFormVisible(true)
            }}><PlusOutlined />新建</Button>
        </Card>
        <Row >
            {dataSource && dataSource.length > 0 ? dataSource.map((item, index) => {
                return (
                    <Col key={index} flex="320px">
                        <Card
                            style={{ width: 300 }}
                            cover={
                                <img
                                    alt={item.name}
                                    src={item.favIco}
                                    style={{ maxWidth: 300 }}
                                />
                            }
                            actions={[
                                <Tooltip title="应用设置">
                                    <SettingOutlined key="setting" onClick={async () => {
                                        await getCategoryAddOrUpdate(item.id)
                                        handleUpdateFormVisible(true);
                                    }} />
                                </Tooltip>,
                                <Tooltip title="数据管理">
                                    <Link to={"/openplatform/appTable/" + item.id}>
                                        <EditOutlined key="edit" />
                                    </Link>
                                </Tooltip>,
                                <Dropdown overlay={getmenu(item.id)}>
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        <EllipsisOutlined key="ellipsis" />
                                    </a>
                                </Dropdown>,

                            ]}
                        >
                            <Meta
                                title={item.name}
                                description={item.description}
                            />
                        </Card>
                    </Col>)
            }) : (<>No data</>)}
        </Row>
        {creatFormVisible && (
            <DynamicForm onSubmit={async (data) => {
                await handleCreateCategory(data)
                handleCreateFormVisible(false);
                //actionRef.current.reload();
            }}
                onCancel={() => {
                    handleCreateFormVisible(false);
                    handleUpdateFormData({});
                    //actionRef.current.reload();
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
                //actionRef.current.reload();
            }}
                onCancel={() => {
                    handleUpdateFormVisible(false);
                    handleUpdateFormData({});
                    //actionRef.current.reload();
                }}
                data={udpateFormData?.data}
                modelData={udpateFormData?.data}
                longIdKey='LongParentId'
                modelTypes={udpateFormData?.modelType || []}
                formModelVisible={updateFormVisible}>

            </DynamicForm>
        )}
    </PageContainer>)
    return (
        <PageContainer>
            <ProTable<AppEntity>
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
                    var res = await appEntityClient.list(params.current, params.pageSize)
                    const data: RequestData<AppEntity> = { success: true, data: res.data, total: res.count, key: ['id'] };
                    return data;
                }}
            >
            </ProTable>

        </PageContainer >
    )
}

export default category;