/**
 * @Author: Ghan 
 * @Date: 2019-11-13 09:41:02 
 * @Last Modified by: Ghan
 * @Last Modified time: 2019-11-29 15:47:25
 * 
 * @todo 开单页面
 */
import Taro from '@tarojs/taro';
import { View, Image, Input, ScrollView, Text } from '@tarojs/components';
import "./style/product.less";
import "../member/style/member.less";
import CartBar from '../../component/cart/cart';
import { ProductAction } from '../../actions';
import { getProductList, getProductSearchList, getSelectProduct } from '../../reducers/app.product';
import { AppReducer } from '../../reducers';
import { connect } from '@tarojs/redux';
import { ProductInterface, ProductService, ProductInterfaceMap } from '../../constants';
import classnames from 'classnames';
import ProductComponent from '../../component/product/product';
import invariant from 'invariant';
import { ResponseCode } from '../../constants/index';
import merge from 'lodash.merge';
import productSdk from '../../common/sdk/product/product.sdk';
import { store } from '../../app';

let ItemHeight: number = -1;
let SectionHeight: number = -1;

const memberPrefix = 'member';
const cssPrefix = 'product';

interface Props { 
  /**
   * @param {productList} 商品数据，商品在分类里
   *
   * @type {ProductInterface.ProductList[]}
   * @memberof Props
   */
  productList: ProductInterface.ProductList[];
  /**
   * @param {pureProductList} 所有商品去掉分类之后合成的数组
   *
   * @type {ProductInterface.ProductInfo[]}
   * @memberof Props
   */
  pureProductList: ProductInterface.ProductInfo[];
  productSearchList: ProductInterface.ProductList[];
  pureProductSearchList: ProductInterface.ProductInfo[];
  selectProduct: ProductInterface.ProductInfo;
}

interface State {
  /**
   * @param {currentType} 左边当前分类
   *
   * @type {ProductInterface.ProductTypeInfo}
   * @memberof State
   */
  currentType: ProductInterface.ProductTypeInfo;
  /**
   * @param {scrollProductId} 右边滑动的id
   *
   * @type {number}
   * @memberof State
   */
  scrollProductId: number;
  searchValue: string;                            
}

class ProductOrder extends Taro.Component<Props, State> {
  
  readonly state: State = {
    currentType: {
      name: '',
      id: 0,
      createTime: ''
    },
    scrollProductId: -1,
    searchValue: ''
  };

  private productScrollList?: Array<ProductInterface.ProductList & { scrollHeight: number }> = undefined;
  
  componentDidShow () {
    this.init();
  }

  public changeCurrentType = (typeInfo: ProductInterface.ProductTypeInfo) => {
    this.setState({ currentType: typeInfo });
  }

  public changeScrollProductId = (id: number) => {
    this.setState({ scrollProductId: id });
  }

  public init = async (): Promise<void> => {
    try {
      const { success, result } = await ProductAction.productInfoGetList();
      invariant(success, result || ResponseCode.error);

      const { selectProduct } = this.props;
      if (selectProduct !== undefined) {
        productSdk.manage({
          type: productSdk.productCartManageType.ADD,
          product: selectProduct
        });
        setTimeout(() => {
          store.dispatch({
            type: ProductInterfaceMap.reducerInterfaces.SET_SELECT_PRODUCT,
            payload: { selectProduct: undefined }
          });
        }, 100);
      }

      const { rows }: { rows: ProductInterface.ProductList[] } = result;
      if (rows.length > 0) {
        const firstType = rows[0];
        this.changeCurrentType(firstType.typeInfo);
      }
      setTimeout(() => {
        this.initItemHeight();
      }, 100);
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public fetchData = () => {
    ProductAction.productInfoGetList();
  }

  public searchData = async () => {
    const { searchValue } = this.state;
    try {
      if (searchValue === '') {
        /**
         * @todo 如果输入的是空则清空搜索
         */
        ProductAction.productInfoEmptySearchList();
      } else {
        Taro.showLoading();
        const { success, result } = await ProductAction.productInfoSearchList({words: searchValue});
        Taro.hideLoading();
        invariant(success, result || ResponseCode.error);
      }
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public getScrollProductId = (productList: ProductInterface.ProductInfo[]) => {
    return productList.length > 0 
      ? productList[0]
        ? productList[0].id
        : -1
      : -1;
  }

  public onNonBarcodeProductClick = () => {
    const product: any = {
      id: `${productSdk.nonBarcodeKey}${new Date().getTime()}`
    };
    console.log('product: ', product);
    productSdk.manage({
      type: productSdk.productCartManageType.ADD,
      product
    });
  }

  /**
   * @todo [点击菜单的时候修改当前菜单并跳转至对应商品]
   *
   * @memberof ProductOrder
   */
  public onTypeClick = (params: ProductInterface.ProductList) => {
    const { typeInfo, productList } = params;
    this.onInput({detail: {value: ''}});
    this.changeScrollProductId(this.getScrollProductId(productList));
    setTimeout(() => {
      this.changeCurrentType(typeInfo);
    }, 100);
  }

  public initItemHeight = () => {
    if (ItemHeight === -1) {
      const query = Taro.createSelectorQuery().in(this.$scope);
      query
        .select('.product-component-base1')
        .boundingClientRect((rect: any) => {
          ItemHeight = rect.height;
        })
        .exec();
    }
  }
  
  public getItemHeight = async (): Promise<number> => {
    if (ItemHeight !== -1) {
      return new Promise((resolve) => {
        resolve(ItemHeight);
      });
    } else {
      return new Promise((resolve) => {
        const query = Taro.createSelectorQuery().in(this.$scope);
        query
          .select('.product-component-base1')
          .boundingClientRect((rect: any) => {
            ItemHeight = rect.height;
            resolve(rect.height);
          })
          .exec();
      });
    }
  }

  public onScanProduct = async () => {
    try {
      /**
       * @todo [先去自己的库里查询商品看是否存在，如果存在则加入购物车]
       * @todo [如果不存在，则去第三方库里查询商品，如果存在则提示是否建档]
       * @todo [如果第三方库里也不存在则提示没有找到该商品]
       */
      Taro
      .scanCode()
      .then(async (res) => {
        Taro.showLoading();
        const result = await ProductService.productInfoScanGet({barcode: res.result});
        if (result.code === ResponseCode.success) {
          Taro.hideLoading();
          // 找到了商品 显示modal名称
          Taro.showToast({
            title: `${result.data.name}`,
            icon: 'none',
          });
          productSdk.manage({
            type: productSdk.productCartManageType.ADD,
            product: result.data
          });
          return;
        }
        // 说明没找到
        const thirdProductResult = await ProductService.productInfoScan({barcode: res.result});
        Taro.hideLoading();
        if (thirdProductResult.code === ResponseCode.success) {
          Taro.showModal({
            title: '提示',
            content: `商品${thirdProductResult.data.barcode}不存在，是否现在建档？`,
            success: ({confirm}) => {
              if (confirm) {
                const params = {
                  scanProduct: thirdProductResult.data,
                  needCallback: true
                };
                Taro.navigateTo({
                  url: `/pages/product/product.add?params=${JSON.stringify(params)}`
                });
              }
            }
          });
          return;
        }
        throw new Error(thirdProductResult.msg || '没有找到该商品');
      })
      .catch(error => {
        Taro.showToast({title: error.message, icon: 'none'});
      });
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  public getSectionHeight = async () => {
    if (SectionHeight === -1) {
      const query = Taro.createSelectorQuery().in(this.$scope);
      query
        .select('.product-component-section-header-height')
        .boundingClientRect((rect: any) => {
          SectionHeight = rect.height;
        })
        .exec();
    }
  }

  public configItemsHeight = (itemHeight: number): Array<ProductInterface.ProductList & { scrollHeight: number }> => {
    if (this.productScrollList) {
      return this.productScrollList;
    }
    const productList: ProductInterface.ProductList[] = merge([], this.props.productList);
    let productScrollList: Array<ProductInterface.ProductList & { scrollHeight: number }> = [];

    for (let i = 0; i < productList.length; i++) {
      const list = productList[i];
      let beforeHeight: number = 0;
      if (productScrollList.length > 0) {
        productScrollList.forEach(list => {
          beforeHeight += list.scrollHeight;
        });
      } 
      productScrollList.push({
        ...list,
        scrollHeight: list.productList.length * itemHeight + beforeHeight + (i * SectionHeight)
      });
    }
    this.productScrollList = productScrollList;
    return productScrollList;
  }

  /**
   * @todo [监听滚动并设置跳转事件]
   *
   * @memberof ProductOrder
   */
  public onScroll = async (event: any) => {
    const { target: { scrollTop } } = event;
    const { currentType } = this.state;

    const ProductItemHeight = await this.getItemHeight();
    const productScrollList = this.configItemsHeight(ProductItemHeight);

    for (let i = productScrollList.length - 1; i >= 0; i--) {
      if (i === 0 && scrollTop < productScrollList[i].scrollHeight) {
        if (currentType.name !== productScrollList[i].typeInfo.name) {
          this.changeCurrentType(productScrollList[i].typeInfo);
          return;
        }
      }
      if (scrollTop > productScrollList[i].scrollHeight) {
        if (currentType.name !== productScrollList[i + 1].typeInfo.name) {
          this.changeCurrentType(productScrollList[i + 1].typeInfo);
          return;
        }
      }
    }
  }

  /**
   * @todo 绑定输入事件
   *
   * @memberof ProductOrder
   */
  public onInput = ({detail}: any) => {
    this.setState({searchValue: detail.value}, () => {
      this.searchData();
    });
  }

  render () {
    const { searchValue } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-header`}>
          <View className={`${memberPrefix}-main-header-search ${cssPrefix}-header-search`}>
            <Image src="//net.huanmusic.com/weapp/icon_import.png" className={`${memberPrefix}-main-header-search-icon`} />
            <Input 
              className={`${memberPrefix}-main-header-search-input`} 
              placeholder="请输入商品名称或条码"
              value={searchValue}
              onInput={this.onInput}
              placeholderClass={`${memberPrefix}-main-header-search-input-holder`}
            />
            <View onClick={() => this.onScanProduct()} >
              <Image src="//net.huanmusic.com/weapp/icon_commodity_scan.png" className={`${memberPrefix}-main-header-search-scan`} />
            </View>
          </View>
          <View 
            className={`${cssPrefix}-header-button`}
            onClick={() => this.onNonBarcodeProductClick()}
          >
            无码商品
          </View>
        </View>
        
        <View className={`${cssPrefix}-list-container`}>
          {this.renderLeft()}  
          {this.renderRight()}
        </View>
        <CartBar />
      </View>
    );
  }

  /**
   * @todo [当有搜索商品数据的时候左边不显示active菜单但是点击事件依然可以触发，点击菜单的时候清空搜索并跳转至正常位置]
   *
   * @private
   * @memberof ProductOrder
   */
  private renderLeft = () => {
    const { currentType, searchValue } = this.state; 
    const { productList, pureProductSearchList } = this.props;
    return (
      <ScrollView 
        scrollY={true}
        className={`${cssPrefix}-list-left`}
      >
        {
          productList && productList.length > 0
            ? productList.map((list) => {
              
              return (
                <View 
                  key={list.typeInfo.id}
                  className={classnames(`${cssPrefix}-list-left-item`, {
                    [`${cssPrefix}-list-left-item-active`]: searchValue === '' && pureProductSearchList.length === 0 && list.typeInfo.id === currentType.id
                  })}
                  onClick={() => this.onTypeClick(list)}
                >
                  {searchValue === '' && pureProductSearchList.length === 0 && list.typeInfo.id === currentType.id && (
                    <View className={`${cssPrefix}-list-left-item-active-bge`} />
                  )}
                  {list.typeInfo.name}
                </View>
              );
            })
            : <View />
        }
      </ScrollView>
    );
  }

  private renderRight = () => {
    const { productList, pureProductSearchList } = this.props;
    const { currentType, scrollProductId, searchValue } = this.state;

    if (pureProductSearchList.length === 0 && searchValue === '') {
      return (
        <View className={`${cssPrefix}-list-right`}>
          <View className={`${cssPrefix}-list-right-header product-component-section-header-height`}>
            <View className={`${cssPrefix}-list-right-header-bge`}/>
            <Text className={`${cssPrefix}-list-right-header-text`}>{currentType.name}</Text>
          </View>
          <ScrollView 
            scrollY={true}
            className={`${cssPrefix}-list-right ${cssPrefix}-list-right-container`}
            scrollIntoView={`product${scrollProductId}`}
            onScroll={this.onScroll}
          >
            {
              productList && productList.length > 0
                ? productList.map((list, index) => {
                  const { typeInfo } = list;
                  return (
                    <View key={typeInfo.id}>
                      {
                        index !== 0 && (
                          <View className={`${cssPrefix}-list-right-header `}>
                            <View className={`${cssPrefix}-list-right-header-bge`}/>
                            <Text className={`${cssPrefix}-list-right-header-text`}>{typeInfo.name}</Text>
                          </View>
                        )
                      }
                      {
                        list.productList.map((product) => {
                          return (
                            <View    
                              id={`product${product.id}`}
                              className="product-component-base1"
                              key={product.id}
                            >
                              <ProductComponent
                                product={product}
                              />  
                            </View>
                          );
                        })
                      }
                    </View>
                  );
                })
                : <View />
            }
          </ScrollView>  
        </View>
      );
    } 
    return (
      <View className={`${cssPrefix}-list-right`}>
        <ScrollView 
          scrollY={true}
          className={`${cssPrefix}-list-right ${cssPrefix}-list-right-container`}
        >
          {
            pureProductSearchList.map((product) => {
              return (
                <View    
                  id={`product${product.id}`}
                  className="product-component-base1"
                  key={product.id}
                >
                  <ProductComponent
                    product={product}
                  />  
                </View>
              );
            })
          }
        </ScrollView>  
      </View>
    );
  }
}

const mapState = (state: AppReducer.AppState) => {
  const productList = getProductList(state) || [];
  const pureProductList: ProductInterface.ProductInfo[] = [];
  productList.forEach((list) => {
    list.productList.forEach((item) => {
      pureProductList.push(item);
    });
  });

  const productSearchList = getProductSearchList(state) || [];
  const pureProductSearchList: any[] = [];
  productSearchList.forEach((list) => {
    list.productList.forEach((item) => {
      pureProductSearchList.push(item);
    });
  });
  const selectProduct: any = getSelectProduct(state);

  return {
    productList,
    pureProductList,
    productSearchList,
    pureProductSearchList,
    selectProduct,
  };
};

export default connect(mapState)(ProductOrder);