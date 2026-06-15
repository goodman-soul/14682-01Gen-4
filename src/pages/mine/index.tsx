import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

const MinePage: React.FC = () => {
  const { isGuest, userInfo, currentProperty, login, logout, switchProperty } = useAppStore();

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
    console.log('[Mine] 用户登录');
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.showToast({ title: '已退出登录', icon: 'none' });
        }
      }
    });
  };

  const handleSwitchProperty = (propertyId: string) => {
    switchProperty(propertyId);
    Taro.showToast({ title: '已切换房产', icon: 'success' });
  };

  const handleMenuClick = (type: string) => {
    if (isGuest && type !== 'about') {
      Taro.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) handleLogin();
        }
      });
      return;
    }
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  useDidShow(() => {
    console.log('[Mine] 页面展示', { isGuest, properties: userInfo?.properties.length });
  });

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            {isGuest ? (
              <Text>👤</Text>
            ) : userInfo?.avatar ? (
              <Image
                className={styles.avatarImg}
                src={userInfo.avatar}
                mode="aspectFill"
                onError={(e) => console.error('[Mine] 头像加载失败', e.detail)}
              />
            ) : (
              <Text>👤</Text>
            )}
          </View>
          <View className={styles.userDetails}>
            {isGuest ? (
              <>
                <Text className={styles.userName}>游客</Text>
                <Text className={styles.userPhone}>登录后体验完整服务</Text>
              </>
            ) : (
              <>
                <Text className={styles.userName}>{userInfo?.name}</Text>
                <Text className={styles.userPhone}>{userInfo?.phone}</Text>
              </>
            )}
          </View>
          {isGuest && (
            <Button className={styles.loginBtn} onClick={handleLogin}>立即登录</Button>
          )}
        </View>
      </View>

      <View className={styles.container}>
        <View className={styles.propertyCard}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>我的房产</Text>
            {!isGuest && (
              <Text
                className={styles.manageLink}
                onClick={() => Taro.navigateTo({ url: '/pages/property-manage/index' })}
              >
                管理 ›
              </Text>
            )}
          </View>
          {isGuest ? (
            <Text className={styles.guestProperty}>登录后可查看您的房产信息</Text>
          ) : (
            <View className={styles.propertyList}>
              {userInfo?.properties.map((p) => (
                <View
                  key={p.id}
                  className={classnames(
                    styles.propertyItem,
                    currentProperty?.id === p.id && styles.propertyItemActive
                  )}
                  onClick={() => handleSwitchProperty(p.id)}
                >
                  <View className={styles.propertyLeft}>
                    <Text className={styles.propertyAddr}>{p.communityName}</Text>
                    <Text className={styles.propertyDetail}>{p.building} · {p.room}</Text>
                  </View>
                  <View className={styles.propertyRight}>
                    {p.isDefault && <Text className={styles.defaultTag}>默认</Text>}
                    {currentProperty?.id === p.id && <Text className={styles.activeCheck}>✓</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => handleMenuClick('repair')}>
            <View className={styles.menuIcon}>🔧</View>
            <Text className={styles.menuText}>我的报修</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('payment')}>
            <View className={styles.menuIcon}>💰</View>
            <Text className={styles.menuText}>缴费记录</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('family')}>
            <View className={styles.menuIcon}>👨‍👩‍👧</View>
            <Text className={styles.menuText}>家庭成员</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('settings')}>
            <View className={styles.menuIcon}>⚙️</View>
            <Text className={styles.menuText}>设置</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('about')}>
            <View className={styles.menuIcon}>ℹ️</View>
            <Text className={styles.menuText}>关于我们</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        {!isGuest && (
          <Button className={styles.logoutBtn} onClick={handleLogout}>退出登录</Button>
        )}
      </View>
    </View>
  );
};

export default MinePage;
