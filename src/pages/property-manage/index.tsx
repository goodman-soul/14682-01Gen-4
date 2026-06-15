import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

const PropertyManagePage: React.FC = () => {
  const { isGuest, userInfo, currentProperty, switchProperty, login } = useAppStore();

  const handleSwitch = (propertyId: string) => {
    switchProperty(propertyId);
    Taro.showToast({ title: '已切换房产', icon: 'success' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' });
    }, 800);
  };

  const handleAdd = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  if (isGuest) {
    return (
      <View className={styles.page}>
        <View className={styles.guestCard}>
          <Text className={styles.guestIcon}>🏠</Text>
          <Text className={styles.guestText}>登录后可查看和管理您的房产</Text>
          <Button className={styles.addBtn} onClick={handleLogin}>立即登录</Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <Text className={styles.tip}>点击房产可快速切换，所有服务将随之切换数据范围</Text>

      {userInfo?.properties.map((p) => (
        <View
          key={p.id}
          className={classnames(styles.card, currentProperty?.id === p.id && styles.cardActive)}
          onClick={() => handleSwitch(p.id)}
        >
          <View className={styles.row}>
            <View className={styles.left}>
              <Text className={styles.community}>{p.communityName}</Text>
              <Text className={styles.address}>{p.building} · {p.room}</Text>
              <View className={styles.tags}>
                {p.isDefault && <Text className={classnames(styles.tag, styles.tagDefault)}>默认房产</Text>}
                {currentProperty?.id === p.id && <Text className={classnames(styles.tag, styles.tagActive)}>当前使用</Text>}
              </View>
            </View>
            <View className={styles.right}>
              {currentProperty?.id === p.id && <View className={styles.check}>✓</View>}
            </View>
          </View>
        </View>
      ))}

      <Button className={styles.addBtn} onClick={handleAdd}>+ 添加房产</Button>
    </View>
  );
};

export default PropertyManagePage;
