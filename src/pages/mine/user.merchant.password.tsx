import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import "../style/user.less";
import Item from './component/item'

const cssPrefix = 'user';

type State = {
  value: string;
};

class UserMerchantEdit extends Taro.Component<any, State> {
  readonly state: State = {
    value: ''
  };

  public onChangeValue = (key: string, value: any) => {
    this.setState(prevState => {
      return {
        ...prevState,
        [`${key}`]: value
      };
    });
  }

  public onSave = () => {
    Taro.showToast({
      title: '保存成功！'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  }

  render () {
    const { value } = this.state;
    return (
      <View className="container container-color">
        <View className={`${cssPrefix}-merchant`}>
          <Item>
            <Input
              value={value}
              className={`${cssPrefix}-merchant-area`}
              onInput={({detail: {value}}) => this.onChangeValue('value', value)}
            />
          </Item>
          
          <View className={`product-add-buttons-one ${cssPrefix}-merchant-button`}>
            <AtButton
              className="theme-button"
              onClick={() => this.onSave()}
            >
              <Text className="theme-button-text" >保存</Text>
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}

export default UserMerchantEdit;