
/**
 * @Author: Ghan 
 * @Date: 2019-11-13 10:26:45 
 * @Last Modified by: Ghan
 * @Last Modified time: 2019-11-18 16:53:49
 */

import { ProductInterface, ProductInterfaceMap } from "../constants";
import { AppReducer } from './index';
import isArray from 'lodash/isArray';

export declare namespace ProductReducer {
  interface InitState {
    productList: Array<ProductInterface.ProductList>;
    productSearchList: Array<ProductInterface.ProductList>;
    productManageList: {
      total: number;
      data: Array<ProductInterface.ProductInfo>;
    };
    productType: Array<ProductInterface.ProductType>;
    productSupplier: Array<ProductInterface.ProductSupplier>;
    productDetail: ProductInterface.ProductInfo;
  }

  interface Action {
    type: 
      ProductInterface.RECEIVE_PRODUCT_LIST
      | ProductInterface.RECEIVE_PRODUCT_SEARCH_LIST
      | ProductInterface.RECEIVE_PRODUCT_TYPE
      | ProductInterface.RECEIVE_PRODUCT_SUPPLIER
      | ProductInterface.RECEIVE_PRODUCT_DETAIL;
    payload: any;
  }
}

const initState: ProductReducer.InitState = {
  productList: [],
  productSearchList: [],
  productManageList: {
    total: -1,
    data: []
  },
  productType: [],
  productSupplier: [],
  productDetail: {
    id: -1,
    cost: -1,
    limitNum: -1,
    memberPrice: -1,
    merchantId: -1,
    number: -1,
    price: -1,
    saleType: -1,
    status: -1,
    type: -1,
    barcode: '',
    brand: '',
    pictures: '',
    standard: '',
    supplier: '',
    unit: '',
    firstLetter: '',
    name: '',
    updateBy: '',
    createBy: '',
    createTime: '',
    updateTime: '',
  },
};

export default function productReducer (state: ProductReducer.InitState = initState, action: ProductReducer.Action): ProductReducer.InitState {
  switch (action.type) {
    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_MANAGE_LIST: {
      const { payload: { rows, total } } = action;
      return {
        ...state,
        productManageList: {
          data: rows,
          total: total,
        }
      };
    }

    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_LIST: {
      const { payload: { rows } } = action;
      return {
        ...state,
        productList: rows
      };
    }

    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SEARCH_LIST: {
      const { payload: { rows } } = action;
      return {
        ...state,
        productSearchList: rows
      };
    } 

    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_TYPE: {
      const { payload } = action;
      return { 
        ...state,
        productType: payload
      };
    }

    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_SUPPLIER: {
      const { payload } = action;
      return { 
        ...state,
        productSupplier: payload
      };
    }

    case ProductInterfaceMap.reducerInterfaces.RECEIVE_PRODUCT_DETAIL: {
      const { payload } = action;
      return {
        ...state,
        productDetail: payload
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}

export function getProductManageListIndexes (list: ProductInterface.ProductInfo[] = []): ProductInterface.IndexProducList[] {
  const indexesList: ProductInterface.IndexProducList[] = [];
  if (isArray(list) === false) {
    return [];
  }

  if (list.length === 0) {
    return [];
  }

  list.forEach((data) => {
    if (!!data.firstLetter) {
      const index = indexesList.findIndex(i => i.title === data.firstLetter);
      if (index !== -1) {
        indexesList[index].data.push(data);
      } else {
        indexesList.push({
          key: data.firstLetter,
          title: data.firstLetter,
          data: [data]
        });
      }
    }
  });
  return indexesList;
}

export const getProductList = (state: AppReducer.AppState) => state.product.productList;

export const getProductSearchList = (state: AppReducer.AppState) => state.product.productSearchList;

export const getProductManageList = (state: AppReducer.AppState) => state.product.productManageList.data;

export const getProductType = (state: AppReducer.AppState) => state.product.productType;

export const getProductSupplier = (state: AppReducer.AppState) => state.product.productSupplier;

export const getProductDetail = (state: AppReducer.AppState) => state.product.productDetail;