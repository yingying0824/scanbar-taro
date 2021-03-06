import { combineReducers } from 'redux';
import permission from './app.permission';
import member, { MemberReducer } from './app.member';
import product, { ProductReducer } from './app.product';
import pay, { PayReducer } from './app.pay';
import order, { OrderReducer } from './app.order';
import inventory, { InventoryReducer } from './app.inventory';
import merchant, { MerchantReducer } from './app.merchant';
import report, { ReportReducer } from './app.report';
import user, {UserReducer} from './app.user';
import productSDK, { ProductSDKReducer } from '../common/sdk/product/product.sdk.reducer';

export declare namespace AppReducer {
  interface AppState {
    member: MemberReducer.MemberInitState;
    product: ProductReducer.InitState;
    productSDK: ProductSDKReducer.State;
    pay: PayReducer.State;
    order: OrderReducer.State;
    inventory: InventoryReducer.State;
    merchant: MerchantReducer.State;
    report: ReportReducer.State;
    user: UserReducer.State;
  }
}

const appReducer = combineReducers({ 
  permission,
  member,
  product,
  productSDK,
  pay,
  order,
  inventory,
  merchant,
  report,
  user
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;