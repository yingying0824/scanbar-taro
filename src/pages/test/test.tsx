import Taro from '@tarojs/taro';
import { View, } from '@tarojs/components';
import "./style/test.main.less";
import classnames from 'classnames';
import { AtList, AtListItem } from "taro-ui";

type Props = { };

class TestMain extends Taro.Component<Props, any> {
  render () {
    return (
      <View className={classnames("container")}>
        <AtList>
          <AtListItem title='Echarts' note="图表" onClick={() => Taro.navigateTo({url: '/pages/test/test.echarts'})} />
          <AtListItem title='Result' note="Result" onClick={() => Taro.navigateTo({url: '/pages/pay/pay.result'})} />
          <AtListItem title='TestCart' note="购物车" onClick={() => Taro.navigateTo({url: '/pages/test/test.cart'})} />
          <AtListItem title='Login' note="跳转到登录" onClick={() => Taro.navigateTo({url: '/pages/sign/login'})} />
          <AtListItem title='DatePicker' note="日期选择器" onClick={() => Taro.navigateTo({url: '/pages/test/test.date.picker'})} />
          <AtListItem title='Notice' note="通告栏" onClick={() => Taro.navigateTo({url: '/pages/test/test.notice'})} />
          <AtListItem title='Accordion' note="手风琴" onClick={() => Taro.navigateTo({url: '/pages/test/test.accordion'})} />
          <AtListItem title='Control' note="控制组件" onClick={() => Taro.navigateTo({url: '/pages/test/test.control'})} />
          <AtListItem title='ListView' note="列表组件" onClick={() => Taro.navigateTo({url: '/pages/test/test.listview'})} />
          <AtListItem title='Modal' note="模态窗" onClick={() => Taro.navigateTo({url: '/pages/test/test.modal'})} />
          <AtListItem title='Form' note="表单" onClick={() => Taro.navigateTo({url: '/pages/test/test.form'})} />
        </AtList>
      </View>
    );
  }
}

export default TestMain;