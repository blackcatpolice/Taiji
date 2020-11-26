import React from 'react'
import {Form, Input,Modal} from 'antd'
 
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};
const identityClientCreateForm : React.FC<{  
    onCancel?: () => void,
    onSubmit: (values: any) => void,
    formModelVisible?: boolean,
}>=(props)=>{
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const {onSubmit,onCancel,formModelVisible} = props
    return (
        <Modal  
        visible={formModelVisible}
        onCancel={() => {
            form.resetFields()
            onCancel && onCancel()
        }}
        onOk={() => {
            onSubmit(form.getFieldsValue())
        }}>
             <Form {...formLayout} form={form} >
                <FormItem label="ClientName" name="ClientName"> 
                    <Input  />
                </FormItem>
                <FormItem label="ClientId" name="ClientId">
                    <Input  />
                </FormItem>
                <FormItem label="ClientSecret" name="ClientSecret">
                    <Input  />
                </FormItem> 
            </Form>
        </Modal>
   )
}

export default identityClientCreateForm;