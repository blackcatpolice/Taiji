export enum ControlType {
    Default,
    Input,
    Hidden,
    FileList,
    File,
    Img,
    Video,
    Iframe,
    TextArea_Editor,
    TextArea,
    Radio,
    List,
    Date,
    Phone,
    Email,
    Number,
    DynamicGroup,
    DynamicGroup_Backup,
    Label,
    ParentPoint,
    Cron,
    Tree,
    CodeEditor,
    CheckBox
}
export interface ModelType {
    name: string,
    propName: string,
    controlType: ControlType,
    order: number,
    required: boolean,
    dataSource: object,
    showOnList: boolean,
    typeName: string
}