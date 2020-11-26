import { FilebaseSetting, FilebaseClient } from '@/apis/API'

export default class FileBaseService {
    private filebaseSetting = new FilebaseSetting();
    private filebaseClient = new FilebaseClient();
    baseUrl = location.protocol+"//"+location.host

    get Setting() {
        return (async () => {
            var setting = await this.filebaseClient.getSetting();
            let keys = {
                AK: setting?.aliOSSAK ?? setting?.qiniuAK ?? "",
                SK: setting?.aliOSSSK ?? setting?.qiniuSK ?? ""
            }
            return {
                type: setting?.useFilebase || "local",
                keys: keys
            }
        })
    }
    public async Upload(name: string, file: Blob): Promise<string> {
        console.log('filebase service upload')
        var type = (await this.Setting()).type
        switch (type) {
            default:
            case "local": 
                var res = await this.filebaseClient.uploadFile({ fileName: name, data: file }) 
                return this.baseUrl+ res;
            case "alioss":
                break;
            case "qiniu":

                break;
        }
        return "";
    }
}