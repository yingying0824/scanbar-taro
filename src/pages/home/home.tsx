import { ComponentClass } from 'react';
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './style/home.less';
import classnames from 'classnames';
import { Card } from '../../component/common/card/card.common';

const NavItems = [
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '商品管理',
    subTitle: 'Commodity management',
  },
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '会员管理',
    subTitle: 'Member management',
  },
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '收款',
    subTitle: 'Gathering',
  },
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '采购收货',
    subTitle: 'Procurement',
  },
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '采购下单',
    subTitle: 'Purchasing order',
  },
  {
    image: '//net.huanmusic.com/weapp/icon_menu_order.png',
    value: '更多',
    subTitle: 'Even more',
  }
];

type PageState = {};
type IProps = {};

interface Home {
  props: IProps;
}

class Home extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  };

  render () {
    return (
      <View className={classnames(['container', 'home'])}>
        <View className="home-name">
          <Image src="//net.huanmusic.com/weapp/icon_shop.png" className={classnames(['home-name-icon', 'home-icon'])} />
          <Text className="home-name-text">可乐便利店</Text>
        </View>
        <Card card-class="home-card">
          <View className="home-buttons">
            <View className="home-buttons-button home-buttons-button-border">
              <View className="normal-text">今日销售额 ></View>
              <View className="home-money">100000.00</View>
            </View>
            <View className="home-buttons-button home-buttons-button-end">
              <View className="normal-text">今日销售额 ></View>
              <View className="home-money">100000.00</View>
            </View>
          </View>
        </Card>
        <Card card-class="home-order">
          <Image src="//net.huanmusic.com/weapp/icon_home_bill.png" className="home-order-icon" />
          <Text className="home-order-text" >开单</Text>
        </Card>
        <View className="home-bar">
          {
            NavItems.map((item, index) => {
              return (
                <Card 
                  key={item.value}
                  shadow={false} 
                  card-class={`home-bar-card ${(index + 1) % 3 !== 0 ? 'home-bar-card-right' : ''}`} 
                >
                  <View className="home-bar-card-content">
                    <Image className="home-icon" src={item.image} />
                    <Text className="normal-text">{item.value}</Text>
                    <Text className="home-small-text">{item.subTitle}</Text>
                  </View>
                </Card>
              );
            })
          }
        </View>
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Home as ComponentClass<IProps, PageState>;
