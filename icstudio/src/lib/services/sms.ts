// import Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
// import * as $OpenApi from '@alicloud/openapi-client';
// import { RuntimeOptions } from '@alicloud/tea-util';

// const client = new Dysmsapi20170525({
//     accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
//     accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
//     endpoint: 'dysmsapi.aliyuncs.com',
//     toMap: (obj: any) => {
//         if (obj instanceof $OpenApi.OpenApiRequest) {
//             return {
//                 'Content-Type': 'application/json',
//             };
//         } else {
//             return {};
//            } 
//     }
// });

// export const sendSMS = async (phone: string, code: string) => {
//     const sendSmsRequest = new Dysmsapi20170525.SendSmsRequest({
//         phoneNumbers: phone,
//         signName: process.env.SMS_SIGN_NAME,
//         templateCode: process.env.SMS_TEMPLATE_CODE,
//         templateParam: JSON.stringify({ code }),
//     });

//     const runtime = new RuntimeOptions({});
//     const result = await client.sendSmsWithOptions(sendSmsRequest, runtime);
    
//     if (result.body.code !== 'OK') {
//         throw new Error(result.body.message);
//     }
    
//     return result;
// };