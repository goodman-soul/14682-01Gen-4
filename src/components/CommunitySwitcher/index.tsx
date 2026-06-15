import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

const CommunitySwitcher: React.FC = () => {
  const { currentCommunity, currentProperty, isGuest, userInfo } = useAppStore();

  const handleSwitch = () => {
    if (isGuest) {
      Taro.showModal({
        title: '提示',
        content: '请先登录后切换房产',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            Taro.switchTab({ url: '/pages/mine/index' });
          }
        }
      });
      return;
    }
    Taro.navigateTo({ url: '/pages/property-manage/index' });
  };

  const handleCall = () => {
    if (currentCommunity?.propertyPhone) {
      Taro.makePhoneCall({ phoneNumber: currentCommunity.propertyPhone });
    }
  };

  return (
    <View className={styles.switcher} onClick={handleSwitch}>
      <View className={styles.left}>
        <Text className={styles.communityName}>{currentCommunity?.name || '请选择小区'}</Text>
        <Text className={styles.address}>{currentCommunity?.address}</Text>
        {!isGuest && currentProperty && (
          <View className={styles.propertyInfo}>
            <Text className={styles.propertyTag}>{currentProperty.building} {currentProperty.room}</Text>
            <Text style={{ fontSize: '24rpx', color: '#86909C' }}>切换房产</Text>
          </View>
        )}
        {isGuest && (
          <View className={styles.propertyInfo}>
            <Text className={styles.propertyTag}>游客模式</Text>
            <Text style={{ fontSize: '24rpx', color: '#86909C' }}>登录查看更多</Text>
          </View>
        )}
      </View>
      <View className={styles.right}>
        <Button className={styles.phoneBtn} onClick={(e) => { e.stopPropagation(); handleCall(); }}>
          📞
        </Button>
        <Text className={styles.arrow}>›</Text>
      </View>
    </View>
  );
};

export default CommunitySwitcher;
