import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AppReducer } from '../../reducers';
import "../style/order.less";
import "../style/product.less";
import { OrderAction } from '../../actions';
import invariant from 'invariant';
import { ResponseCode, OrderInterface } from '../../constants/index';
import { getOrderDetail } from '../../reducers/app.order';
import FormRow, { FormRowProps } from '../../component/card/form.row';
import FormCard from '../../component/card/form.card';
import numeral from 'numeral';
import classnames from 'classnames';
import { AtButton } from 'taro-ui';

const cssPrefix = 'order';

type Props = {
  orderDetail: OrderInterface.OrderDetail;
};

type State = {};

class OrderDetail extends Taro.Component<Props, State> {

  componentWillMount() {
    try {
      const { params: { id } } = this.$router;
      invariant(!!id, '请传入订单id');
      this.init(id);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public init = async (id: string) => {
    try {
      const result = await OrderAction.orderDetail({orderNo: id});
      invariant(result.code === ResponseCode.success, result.msg || ' ');
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public onCopy = async () => {
    try { 
      const { orderDetail } = this.props;
      invariant(orderDetail && orderDetail.order && orderDetail.order.orderNo, '请选择要复制的数据');
      await Taro.setClipboardData({data: orderDetail.order.orderNo});
      Taro.showToast({title: '已复制订单号'}); 
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  render () {
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-detail-bg`} />
        <View className={`${cssPrefix}-detail-container`}>
          {this.renderStatus()}
          {this.renderCards()}
        </View>
      </View>
    );
  }

  private renderStatus = () => {
    const { orderDetail } = this.props;
    return (
      <View className={`${cssPrefix}-detail-status`}>
        <Image 
          src="//net.huanmusic.com/weapp/icon_success.png" 
          className={`${cssPrefix}-detail-status-icon`} 
        />
        {orderDetail.order && (
          <View className={`${cssPrefix}-detail-status-detail`}>
            <View
              onClick={() => this.onCopy()}
              className={`${cssPrefix}-detail-status-detail-box`}
            >
              <Text className={`${cssPrefix}-detail-status-result`}>{orderDetail.order.orderNo}</Text>
              <Image 
                src="//net.huanmusic.com/weapp/icon_copy.png"  
                className={`${cssPrefix}-detail-status-copy`}
              />
            </View>
            <Text className={`${cssPrefix}-detail-status-time`}>{orderDetail.order.transTime}</Text>
            <Text className={`${cssPrefix}-detail-status-time`}>可乐</Text>
          </View>
        )}
      </View>
    );
  }

  private renderCards = () => {
    const { orderDetail } = this.props;

    const Form2: FormRowProps[] = orderDetail.order && [
      {
        title: '应收金额',
        extraText: `￥ ${numeral(orderDetail.order.totalAmount).format('0.00')}`,
        extraTextStyle: 'title',
        extraTextBold: 'bold',
      },
      {
        title: `${OrderAction.orderPayType(orderDetail)}收款`,
        extraText: `￥ ${numeral(orderDetail.order.transAmount).format('0.00')}`,
        extraTextStyle: 'title',
        extraTextBold: 'bold',
        hasBorder: false
      },
    ];

    // @ts-ignore
    const Form3: FormRowProps[] = orderDetail.order && [
      {
        title: '商品数量',
        extraText: orderDetail.order.totalNum,
        extraTextColor: '#4d4d4d'
      },
      {
        title: '原价金额',
        extraText: `￥ ${numeral(orderDetail.order.totalAmount).format('0.00')}`,
        extraTextColor: '#4d4d4d'
      },
      {
        title: '商品优惠',
        extraText: `-￥ ${numeral(orderDetail.order.discount).format('0.00')}`,
        extraTextStyle: 'price',
      },
      {
        title: '整单优惠',
        extraText: `-￥ ${numeral(orderDetail.order.erase).format('0.00')}`,
        extraTextStyle: 'price',
        hasBorder: false
      },
    ];

    const memberForm: FormRowProps[] = orderDetail.order && [
      {
        title: '会员',
        extraText: '接口没有返回'
      }
    ];

    return (
      <View className={`${cssPrefix}-detail-cards`}>
        {Form2 && (
          <FormCard items={Form2} />
        )}
        {Form3 && (
          <FormCard items={Form3} />
        )}
        {memberForm && (
          <FormCard items={memberForm} />
        )}
        {orderDetail.orderDetailList && (
          <FormCard>
            <FormRow title="商品详情" />
            {this.renderList()}
          </FormCard>
        )}
        <View className={`${cssPrefix}-area`} />
        {orderDetail.orderDetailList && (
          <View>
            <AtButton
              className="theme-button"
              onClick={() => Taro.showToast({title: '正在开发中', icon: 'none'})}
            >
              <Text className={`theme-button-text`}>
                退货
              </Text>
            </AtButton>
            <View className={`${cssPrefix}-area`} />
          </View>
        )}
      </View>
    );
  }

  private renderList = () => {
    const { orderDetail } = this.props;
    const cssPrefix = 'product';

    return orderDetail.orderDetailList && orderDetail.orderDetailList.map((item, index) => {
      return (
        <View 
          key={item.orderNo}
          className={classnames(`${cssPrefix}-row ${cssPrefix}-row-content`, {
            [`${cssPrefix}-row-border`]: index !== ((orderDetail.orderDetailList as any).length - 1)
          })}
        >
          <View className={`${cssPrefix}-row-content-item`}>
            <Text className={`${cssPrefix}-row-name`}>{item.productName}</Text>
            <Text className={`${cssPrefix}-row-normal`}>{`x ${item.num}`}</Text>
          </View>
          <View className={`${cssPrefix}-row-content-item ${cssPrefix}-row-content-top`}>
            <Text className={`${cssPrefix}-row-normal`}>{`￥ 没有该字段`}</Text>
            <Text className={`${cssPrefix}-row-normal`}>
              {`小计：￥ ${numeral(item.transAmount).format('0.00')}`}
            </Text>
          </View>
        </View>
      );
    });
  }
}

const select = (state: AppReducer.AppState) => ({
  orderDetail: getOrderDetail(state),  
});

export default connect(select)(OrderDetail);