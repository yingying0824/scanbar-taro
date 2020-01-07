import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getProductRefundList } from '../../common/sdk/product/product.sdk.reducer';
import { connect } from '@tarojs/redux';
import productSdk, { ProductCartInterface } from '../../common/sdk/product/product.sdk';
import "../../component/card/form.card.less";
import '../style/product.less';
import '../../styles/theme.less';
import "../../component/cart/cart.less";
import classnames from 'classnames';
import FormCard from '../../component/card/form.card';
import { FormRowProps } from '../../component/card/form.row';
import invariant from 'invariant';
import numeral from 'numeral';
import ProductPayListView from '../../component/product/product.pay.listview';
import { ProductService, ProductInterface, ResponseCode } from '../../constants';

const cssPrefix = 'product';

type Props = { 
  productRefundList: ProductCartInterface.ProductCartInfo[];
};

class ProductRefundPay extends Taro.Component<Props> {

  componentDidMount() {
    productSdk.setSort(productSdk.reducerInterface.PAYLOAD_SORT.PAYLOAD_REFUND);
  }

  public onRefundHandle = async () => {
    try {
      const { productRefundList } = this.props;
      Taro.showLoading();
      const payload: ProductInterface.CashierRefund = {
        order: {
          memberId: null as any,
          orderNo: null as any,
          orderSource: 1,
          payType: 0,
          terminalCd: '-1',
          terminalSn: '-1',
          totalAmount: productSdk.getProductMemberPrice(),
          totalNum: productSdk.getProductNumber(),
          transAmount: productSdk.getProductTransPrice(),
        },
        productInfoList: productRefundList.map((product) => {
          return {
            changeNumber: product.sellNum,
            productId: product.id,
            unitPrice: product.unitPrice || 0,
            remark: product.remark || '',
            transAmount: product.sellNum * productSdk.getProductItemPrice(product)
          };
        }),
      };
      const result = await ProductService.cashierRefund(payload);
      Taro.hideLoading();
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      Taro.showToast({
        title: '退款成功！', 
        duration: 1000,
        success: () => {
          setTimeout(() => {
            Taro.navigateBack({delta: 10});  
          }, 1000);
        }
      });
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }
  
  render () {
    return (
      <View className='container'>
        <View className={`${cssPrefix}-pay-container ${cssPrefix}-pay`} >
          {this.renderListDetail()}
          {this.renderListProductCard()}
        </View>
        {this.renderFooter()}
      </View>
    );
  }

  private setNumber = (num: number | string): string => {
    return numeral(num).format('0.00');
  }

  private renderFooter = () => {
    const { productRefundList } = this.props;
    return (
      <View className={`${cssPrefix}-pay-footer`}>
        <View className={`${cssPrefix}-pay-footer-bg`}>
          <View
            className={classnames(`${cssPrefix}-pay-footer-right`, {
              [`${cssPrefix}-pay-footer-right-active`]: productRefundList.length > 0,
              [`${cssPrefix}-pay-footer-right-disabled`]: productRefundList.length === 0,
            })}
            onClick={() => this.onRefundHandle()}
          >
            退款￥{this.setNumber(numeral(productSdk.getProductTransPrice()).value())}
          </View>
        </View>
      </View>
    );
  }

  private renderListProductCard = () => {
    const { productRefundList } = this.props;
    return (
      <ProductPayListView
        productList={productRefundList}
      />
    );
  }

  private renderListDetail = () => {

    const priceForm: FormRowProps[] = [
      {
        title: '应退金额',
        extraText: `￥${this.setNumber(0)}`,
        extraTextColor: '#333333',
        extraTextBold: 'bold',
        extraTextSize: '36',
        hasBorder: false,
      }
    ];

    const formCard: FormRowProps[] = [
      {
        title: '商品数量',
        extraText: `${0}`
      },
      {
        title: '原价金额',
        extraText: `￥${this.setNumber(0)}`
      },
    ];
    return (
      <View className={`${cssPrefix}-pay-pos`}>
        <FormCard items={priceForm} />
        <FormCard items={formCard} />
      </View>
    );
  }
}

const select = (state: any) => ({
  productRefundList: getProductRefundList(state),
});

export default connect(select)(ProductRefundPay);