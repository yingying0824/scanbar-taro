import { ReportInterface, ReportInterfaceMap, ReportService } from "../constants";
import { ResponseCode } from '../constants/index';
import { store } from '../app';
import { ReportReducer } from "src/reducers/app.report";

class MerchantAction {

  public reportWeekData = async () => {
    const result = await ReportService.reportWeeksData();
    return result;
  }

  public reportBaseSaleInfo = async (params?: ReportInterface.ReportBaseFetchFidle) => {
    const result = await ReportService.reportBaseSaleInfo(params);
    if (result.code === ResponseCode.success) {
      const reducer: ReportReducer.Reducers.ReceiveReportBaseReducer = {
        type: ReportInterfaceMap.reducerInterface.RECEIVE_REPORT_BASE_INFO,
        payload: result.data
      };
      store.dispatch(reducer);
    }
    return result;
  }

  public reportTodayData = async (params?: ReportInterface.ReportTodayDataFetchFidle) => {
    const result = await ReportService.reportTodayData(params);
    if (result.code === ResponseCode.success) {
      const reducer: ReportReducer.Reducers.ReceiveReportBaseReducer = {
        type: ReportInterfaceMap.reducerInterface.RECEIVE_REPORT_TODAY_SALES,
        payload: result.data
      };
      store.dispatch(reducer);
    }
    return result;
  }

}

export default new MerchantAction();