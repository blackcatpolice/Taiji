import React, { useEffect } from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, useModel } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
// import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import { CurrentUser } from '@/interfaces/userInfo/userInfo'
import { UserInfoClient, IdentityClient } from '@/apis/API'
import avatar from '@/assets/avatar.png'

const whitelist = [
  '/user/login',
  '/user/register',
  '/user/forget'
]

// 从接口中获取子应用配置，export 出的 qiankun 变量是一个 promise
export const qiankun = fetch('/config').then(({ apps }) => ({
  // 注册子应用信息
  apps,
  // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
  lifeCycles: {
    afterMount: (props: any) => {
      console.log(props);
    },
  },
  // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
}));



export async function getInitialState(): Promise<{
  currentUser?: CurrentUser;
  settings?: LayoutSettings;
  roles?: string[],
  userToken?: any;
}> {
  // 如果是登录页面，不执行
  if (whitelist.indexOf(history.location.pathname) < 0) {

    try {
      const userInfoClient = new UserInfoClient();
      const identityClient = new IdentityClient();
      const res = await userInfoClient.getUserInfo()
      const roles = await identityClient.getRole()
      const currentUser = {
        avatar: res?.data['avatar'] || avatar,
        name: res?.data['name']
      }
      return {
        roles: roles,
        currentUser,
        settings: defaultSettings,
        userToken: window.localStorage['token']
      };
    } catch (error) {
      console.log(error)
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: CurrentUser, userToken: any };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      console.log('redirect login')
      // 如果没有登录，重定向到 login
      if (!initialState?.userToken && whitelist.indexOf(history.location.pathname) < 0) {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
