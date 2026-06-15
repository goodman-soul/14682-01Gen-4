import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

const GuestTip: React.FC = () => {
  const { isGuest, login } = useAppStore();

  if (!isGuest) return null;

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  return (
    <View className={styles.tipCard}>
      <View className={styles.info}>
        <Text className={styles.title}>欢迎使用智慧物业</Text>
        <Text className={styles.desc}>登录后可体验报修、缴费等完整服务</Text>
      </View>
      <Button className={styles.btn} onClick={handleLogin}>立即登录</Button>
    </View>
  );
};

export default GuestTip;
