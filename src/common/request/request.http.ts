import Taro from '@tarojs/taro';
import getBaseUrl from './base.url';
import interceptors from './interceptors';

interceptors.forEach(i => Taro.addInterceptor(i));

class HttpRequest {
  baseOptions(params: any, method: string = "GET") {
    let { url, data } = params;
    const BASE_URL = getBaseUrl(url);
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    const option: any = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        'Authorization': Taro.getStorageSync('Authorization')
      }
    };
    return Taro.request(option);
  }

  get (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option);
  }

  post (url: string, data: string = "", contentType?: string) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  }

  put (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  }

  delete (url: string, data: string = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  }
}

export default new HttpRequest();