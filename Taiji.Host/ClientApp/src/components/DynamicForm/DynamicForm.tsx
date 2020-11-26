import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, DatePicker, Upload, Tree, Select, Checkbox } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { ModelType, ControlType } from './DynamicForm.d';
import 'braft-editor/dist/index.css'
import BraftEditor, { EditorState } from 'braft-editor'
import BraftEditorWrapper from '../BraftEditor/BraftEditorWrapper'
import FilebaseService from '@/services/FileBaseService'
import moment from 'moment'
import CSS from 'csstype';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const { Option } = Select;

const DynamicForm: React.FC<{
    onCancel?: () => void,
    onSubmit: (values: any) => void,
    longIdKey?: string,
    formModelVisible?: boolean,
    modelTypes: ModelType[],
    modelData?: any,
    data?: any,
    useModal?: boolean
}> = (props) => {
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const { data, longIdKey, useModal, modelTypes, modelData, formModelVisible, onSubmit, onCancel } = props
    const fileds: any = [];
    const [editorState, setEditorState] = useState<EditorState>();
    const [loading, setLoading] = useState<boolean>();
    const [imgUrl, setImgUrl] = useState();


    modelTypes.map((item: any) => {
        fileds.push({
            name: [item.propName]
        })
    })

    const redenrModelItem = (modelTypeItem: ModelType, modelData?: any) => {
        switch (modelTypeItem.controlType) {
            case ControlType.CheckBox:

                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>
                    <Checkbox></Checkbox>
                </FormItem>)
            case ControlType.CodeEditor:
                const aceStyle: CSS.Properties = {
                    width: '100%',
                    height: '800px'
                }
                const codeChange = (content: string) => {
                    var valueObj = {};
                    valueObj[modelTypeItem.propName] = content
                    form.setFieldsValue(valueObj)
                }
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>

                    <AceEditor mode="json" theme="github" onChange={codeChange} value={modelData} style={aceStyle} >
                    </AceEditor>
                </FormItem>)
            case ControlType.TextArea_Editor:
                const editorChange = (contentState: any) => {
                    console.log(contentState.toHTML())
                    var valueObj = {};
                    valueObj[modelTypeItem.propName] = contentState.toHTML()
                    form.setFieldsValue(valueObj)
                }
                console.log(modelTypeItem)
                console.log(modelData)
                useEffect(() => {
                    setEditorState(BraftEditor.createEditorState(modelData))
                }, []);
                var filebaseService = new FilebaseService();
                return (
                    <FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]} >
                        <></>
                        <BraftEditorWrapper
                            value={editorState}
                            //defaultValue={editorState}
                            placeholder='请输入'
                            onChange={editorChange}
                            media={{
                                uploadFn: async (param) => {
                                    var imgUrl = await filebaseService.Upload(param.file.name, param.file)
                                    param.progress(100);
                                    param.success({
                                        url: imgUrl,
                                        meta: {
                                            id: imgUrl,
                                            title: imgUrl,
                                            alt: imgUrl,
                                            loop: false, // 指定音视频是否循环播放
                                            autoPlay: false, // 指定音视频是否自动播放
                                            controls: false, // 指定音视频是否显示控制栏
                                            poster: imgUrl, // 指定视频播放器的封面
                                        }
                                    })
                                }
                            }}></BraftEditorWrapper>

                    </FormItem>
                )
            case ControlType.Hidden:
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]} style={{ display: 'none' }}>

                </FormItem>)
            case ControlType.List:
                var children = Object.keys(modelTypeItem.dataSource).map(item => {
                    return (<Option value={item}>{item}</Option>)
                });
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}  >

                    <Select style={{ width: 120 }} bordered={false}>
                        {children}
                    </Select>
                </FormItem>)
            case ControlType.Tree:
                const onSelect = (selectedKeys: any, info: any) => {
                    console.log('selected', selectedKeys, info);
                };

                const onCheck = (checkedKeys: any, info: any) => {
                    console.log('onCheck', checkedKeys, info);
                    var valueObj = {};

                    if (info.checkedNodes.length > 0) {
                        valueObj[modelTypeItem.propName] = info.checkedNodes[info.checkedNodes.length - 1].key
                        if (longIdKey) {
                            valueObj[longIdKey] = info.checkedNodes.map((item: any) => item.key).join(',');
                        }
                        form.setFieldsValue(valueObj)
                    } else {
                        valueObj[modelTypeItem.propName] = null
                        if (longIdKey) {
                            valueObj[longIdKey] = null
                        }
                        form.setFieldsValue(valueObj)
                    }
                };

                const onLoad = (data: any) => {
                    console.log(data)
                }

                const treeData = [];
                for (const key in modelTypeItem.dataSource) {
                    if (Object.prototype.hasOwnProperty.call(modelTypeItem.dataSource, key)) {
                        const value = modelTypeItem.dataSource[key];
                        treeData.push({
                            title: value,
                            key: key
                        })
                    }
                }
                return (
                    <FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: false }]}>
                        <Tree
                            checkable
                            defaultExpandedKeys={[modelData]}
                            defaultSelectedKeys={[modelData]}
                            defaultCheckedKeys={[modelData]}
                            onSelect={onSelect}
                            onCheck={onCheck}
                            treeData={treeData}
                            onLoad={onLoad}
                        />
                    </FormItem>
                )
            case ControlType.Label:
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>
                    <Input />
                </FormItem>)
            case ControlType.Img:

                var filebaseService = new FilebaseService();
                function getBase64(img: any, callback: (img: any) => void) {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => callback(reader.result));
                    reader.readAsDataURL(img);
                }
                const handleChange = (info: any) => {
                    if (info.file.status === 'uploading') {
                        setLoading(true);
                        return;
                    }
                    if (info.file.status === 'done') {
                        // Get this url from response in real world.
                        getBase64(info.file.originFileObj, (imageUrl: any) => {
                            setLoading(false)
                            setImgUrl(imageUrl)
                        });
                        var valueObj = {};
                        valueObj[modelTypeItem.propName] = info.file.response
                        form.setFieldsValue(valueObj)
                        console.log(valueObj)
                    }
                };
                const uploadButton = (
                    <div>
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                );

                return (
                    <FormItem label={modelTypeItem.name} key={modelTypeItem.propName} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}  >
                        <Upload
                            name={modelTypeItem.propName}
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            customRequest={async (info: any) => {
                                console.log(info)
                                var truePath = await filebaseService.Upload(info.file.name, info.file)
                                info.onSuccess(truePath, info.file)
                            }}
                            onChange={handleChange}
                        >
                            {(imgUrl || modelData) ? <img src={(imgUrl || modelData)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </FormItem>
                );
            case ControlType.File:
                return (<Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>)
            case ControlType.Date:
                var dateObj = {};
                dateObj[modelTypeItem.propName] = moment(modelData)
                form.setFieldsValue(dateObj)
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>
                    <DatePicker />
                </FormItem>)
            case ControlType.Number:
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>
                    <InputNumber />
                </FormItem>)
            case ControlType.Default:
            case ControlType.Input:
            default:
                return (<FormItem label={modelTypeItem.name} name={modelTypeItem.propName} rules={[{ required: modelTypeItem.required }]}>
                    <Input />
                </FormItem>)
        }
    }
    const renderContent = () => {
        const formList = [];
        for (const modleItem of modelTypes) {
            let modelDataItem = modelData && modelData[modleItem.propName]
            formList.push(redenrModelItem(modleItem, modelDataItem))
        }

        return formList
    }
    if (useModal) {
        return (

            <Modal
                width={1024}
                visible={formModelVisible}
                onCancel={() => {
                    form.resetFields()
                    onCancel && onCancel()
                }}
                onOk={() => {
                    onSubmit(form.getFieldsValue())
                }}
            >
                <Form
                    {...formLayout}
                    form={form}
                    fields={fileds}
                    initialValues={data}
                >
                    {renderContent()}
                </Form>
            </Modal >)
    } else {
        return (
            <Form
                {...formLayout}
                form={form}
                fields={fileds}
                initialValues={data}
            >
                {renderContent()}
                <FormItem>
                    <Button type="primary" onClick={() => {
                        onSubmit(form.getFieldsValue())
                    }}>保存</Button>
                </FormItem>
            </Form>)
    }

}

DynamicForm.defaultProps = { useModal: true }
export default DynamicForm;