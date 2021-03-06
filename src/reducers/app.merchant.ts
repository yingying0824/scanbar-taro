import MerchantInterfaceMap, { MerchantInterface } from '../constants/merchant/merchant';
// import merge from 'lodash.merge';
import { AppReducer } from './';

export declare namespace MerchantReducer {
  namespace Reducers {
    interface ReceiveMerchantDetail {
      type: MerchantInterface.ReducerTypes.RECEIVE_MERCHANT_DETAIL;
      payload: MerchantInterface.MerchantDetail;
    }

    interface ReceiveMerchantSubList {
      type: string;
      payload: {rows: MerchantInterface.MerchantDetail[]};
    }

    interface ReceiveUserProfileInfo {
      type: MerchantInterface.ReducerTypes.RECEIVE_PROFILE_INFO;
      payload: MerchantInterface.ProfileInfo;
    }
  }
  
  interface State {
    merchantDetail: MerchantInterface.MerchantDetail;
    profileInfo: MerchantInterface.ProfileInfo;
    merchantSubList: MerchantInterface.MerchantDetail[];
  }

  type Action = 
    Reducers.ReceiveMerchantDetail |
    Reducers.ReceiveUserProfileInfo |
    Reducers.ReceiveMerchantSubList;
}

export const initState: MerchantReducer.State = {
  merchantDetail: {} as any,
  profileInfo: {} as any,
  merchantSubList: [],
};

export default function merchant (state: MerchantReducer.State = initState, action: MerchantReducer.Action): MerchantReducer.State {
  switch (action.type) {

    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_SUB_LIST: {
      const { payload } = action as MerchantReducer.Reducers.ReceiveMerchantSubList;
      return {
        ...state,
        merchantSubList: payload.rows
      };
    }

    case MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL: {
      const { payload } = action as MerchantReducer.Reducers.ReceiveMerchantDetail;
      return {
        ...state,
        merchantDetail: payload
      };
    }

    case MerchantInterfaceMap.reducerInterface.RECEIVE_PROFILE_INFO: {
      const { payload } = action as MerchantReducer.Reducers.ReceiveUserProfileInfo;
      return {
        ...state,
        profileInfo: payload
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}

export const getMerchantDetail = (state: AppReducer.AppState) => state.merchant.merchantDetail;

export const getProfileInfo = (state: AppReducer.AppState) => state.merchant.profileInfo;

export const getMerchantSubList = (state: AppReducer.AppState) => state.merchant.merchantSubList;