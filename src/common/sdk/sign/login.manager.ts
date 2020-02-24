/**
 * @Author: Ghan 
 * @Date: 2019-11-08 17:10:29 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-02-17 16:40:46
 */

import Taro from '@tarojs/taro';
import md5 from 'blueimp-md5';
import requestHttp from '../../request/request.http';
import { ResponseCode, ActionsInterface, MerchantInterfaceMap } from '../../../constants/index';
import { store } from '../../../app';

export const CentermOAuthKey: string = 'CentermOAuthToken';

export declare namespace LoginInterface {

  interface OAuthTokenParams {
    phoneNumber: string;
    password: string;
  }

  interface AuthMenu {
    id: number;
    name: string;
  }

  interface CheckPermissionsResult {
    success: boolean;
    grantedPermissions?: Array<string>;
    declinedPermissions?: Array<string>;
  }

  interface LoginMangerInfo<T> {
    success: boolean;
    result: T;
    msg: string;
  }

  interface OAuthToken {
    token: string;
    phone: string;
    loginId: string;
    name: string;
    menus: AuthMenu[];
    merchantInfoDTO: MerchantInfoDTO;
    roleIds: any[];
    roleNames: string;
  }

  interface MerchantInfoDTO {
    name: string;
    address: string;
    contactName: string;
    id: string;
    institutionCode: string;
    logo: string;
    parentId: string;
    phoneNumber: string;
    type: string;
    userId: string;
  }

  interface LoginManagerConfig {
    oatuhToken: string;
  }

  type RECEIVE_AUTH = string;
  interface ReducerInterface {
    RECEIVE_AUTH: RECEIVE_AUTH;
  }
}

class LoginManager {

  public reducerInterface: LoginInterface.ReducerInterface = {
    RECEIVE_AUTH: 'RECEIVE_AUTH'
  };

  public LoginManagerConfig: LoginInterface.LoginManagerConfig = {
    oatuhToken: '/oauth/token',
  };

  public autoToken = async (params: LoginInterface.OAuthTokenParams): Promise<any> => {
    const result = await requestHttp.post(this.LoginManagerConfig.oatuhToken, params);
    if (result.code === ResponseCode.success) {
      return { success: true, result: result.data };
    } else {
      return { success: false, result: result.msg };
    }
  }

  /**
   * @todo [登录]
   *
   * @memberof LoginManager
   */
  public login = async (params: LoginInterface.OAuthTokenParams): Promise<LoginInterface.LoginMangerInfo<LoginInterface.OAuthToken>> => {
    const payload: LoginInterface.OAuthTokenParams = {
      ...params,
      password: md5(params.password)
    };
    const { success, result } = await this.autoToken(payload);
    store.dispatch({
      type: MerchantInterfaceMap.reducerInterface.RECEIVE_USER_INFO,
      payload: {data: result}
    });
    if (success === true) {
      return new Promise((resolve) => {
        Taro
          .setStorage({ key: CentermOAuthKey, data: JSON.stringify(result) })
          .then(() => {
            resolve({ success: true, result, msg: '' });
          })
          .catch(error => resolve({ success: false, result: {} as any, msg: error.message || '登录失败' }));
      });
    } else {
      return new Promise((resolve) => {
        resolve({ success: false, result: {} as any, msg: result || '登录失败' });
      });
    }
  }

  /**
   * @todo [退出登陆]
   *
   * @memberof LoginManager
   */
  public logout = async (): Promise<ActionsInterface.ActionBase<string>> => {
    return new Promise((resolve, reject) => {
      Taro
        .setStorage({ key: CentermOAuthKey, data: '' })
        .then(() => {
          resolve({ success: true, result: '' });
        })
        .catch(error => {
          reject({ success: false, result: error.message });
        });
    });
  }

  /**
   * @todo [获取用户token]
   *
   * @memberof LoginManager
   */
  public getUserInfo = (): Promise<LoginInterface.LoginMangerInfo<LoginInterface.OAuthToken>> => {
    return new Promise((resolve) => {
      Taro
        .getStorage({ key: CentermOAuthKey })
        .then(data => {
          if (data.data !== '') {
            store.dispatch({
              type: MerchantInterfaceMap.reducerInterface.RECEIVE_USER_INFO,
              payload: {data: JSON.parse(data.data)}
            });
            resolve({ success: true, result: JSON.parse(data.data), msg: '' });
          } else {
            resolve({ success: false, result: {} as any, msg: '请先登录' });
          }
        })
        .catch(error => {
          resolve({ success: false, result: {} as any, msg: error.message });
        });
    });
  }

  public setUserInfo = async (params: any, isMerchant: boolean) => {
    const res = await this.getUserInfo();
    let userinfo = {};
    if (isMerchant) {
      userinfo = {...res.result, merchantInfoDTO: {...res.result.merchantInfoDTO, ...params}};
    } else {
      userinfo = {...res.result, ...params};
    }
    console.log('test hhh', userinfo);
    
    store.dispatch({
      type: MerchantInterfaceMap.reducerInterface.RECEIVE_USER_INFO,
      payload: {data: userinfo}
    });
    if (res.success) {
      return new Promise((resolve, reject) => {
        Taro
          .setStorage({ key: CentermOAuthKey, data: JSON.stringify(userinfo) })
          .then(() => {
            resolve({ success: true, result: '' });
          })
          .catch(error => {
            reject({ success: false, result: error.message });
          });
      });
    } else {
      return {
        success: false, result: '获取用户信息失败'
      };
    }
  }

  public getUserToken = (): ActionsInterface.ActionBase<string> => {
    const userinfo = Taro.getStorageSync(CentermOAuthKey);
    if (userinfo) {
      return { success: true, result: JSON.parse(userinfo).token };
    } else {
      return { success: false, result: '' };
    }
  }

  /**
   * @todo [获取用户权限]
   *
   * @memberof LoginManager
   */
  public getUserPermissions = async (): Promise<Array<any>> => {
    return [];
  }

  /**
   * @todo [校验用户是否开放权限]
   *
   * @memberof LoginManager
   */
  public checkUserPermissions = async (permissions: Array<string>): Promise<LoginInterface.CheckPermissionsResult> => {
    // console.log('permissions: ', permissions);
    return { success: true, grantedPermissions: [], declinedPermissions: [] };
  }
}

export default new LoginManager();