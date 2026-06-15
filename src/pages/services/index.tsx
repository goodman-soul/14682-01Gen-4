import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import { getUnpaidBills } from '@/data/payments';
import { getRepairsByProperty } from '@/data/repairs';
import { ServiceMenuItem } from '@/types';

const ServicesPage: React.FC = () => {
  const { currentCommunity, isGuest, currentProperty } = useAppStore();

  const unpaidCount = useMemo(() => {
    if (!currentProperty || isGuest) return 0;
    return getUnpaidBills(currentProperty.id).length;
  }, [currentProperty, isGuest]);

  const processingRepairs = useMemo(() => {
    if (!currentProperty || isGuest) return 0;
    return getRepairsByProperty(currentProperty.id).filter(r => r.status === 'pending' || r.status === 'processing').length;
  }, [currentProperty, isGuest]);

  const categorizedServices = useMemo(() => {
    if (!currentCommunity) return {};
    const result: Record<string, ServiceMenuItem[]> = {};
    currentCommunity.serviceMenu.forEach(item => {
      if (!result[item.category]) result[item.category] = [];
      result[item.category].push(item);
    });
    return result;
  }, [currentCommunity]);

  const categoryNames: Record<string, string> = {
    property: '物业服务',
    life: '生活服务',
    travel: '出行服务'
  };

  const handleServiceClick = (item: ServiceMenuItem) => {
    if (item.requireAuth && isGuest) {
      Taro.showModal({
        title: '提示',
        content: '请登录后使用该功能',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            Taro.switchTab({ url: '/pages/mine/index' });
          }
        }
      });
      return;
    }
    Taro.navigateTo({ url: item.pagePath });
  };

  useDidShow(() => {
    console.log('[Services] 页面展示', { community: currentCommunity?.name, servicesCount: currentCommunity?.serviceMenu.length });
  });

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerTitle}>{currentCommunity?.name}</Text>
        <Text className={styles.headerDesc}>服务热线：{currentCommunity?.propertyPhone}</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{isGuest ? '-' : unpaidCount}</Text>
            <Text className={styles.statLabel}>待缴账单</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{isGuest ? '-' : processingRepairs}</Text>
            <Text className={styles.statLabel}>处理中报修</Text>
          </View>
        </View>
      </View>

      {Object.keys(categorizedServices).length > 0 ? (
        Object.entries(categorizedServices).map(([category, items]) => (
          <View key={category} className={styles.categorySection}>
            <Text className={styles.categoryTitle}>{categoryNames[category] || category}</Text>
            <View className={styles.serviceGrid}>
              {items.map((item) => (
                <View
                  key={item.id}
                  className={classnames(styles.serviceItem, item.requireAuth && isGuest && styles.disabled)}
                  onClick={() => handleServiceClick(item)}
                >
                  <View className={styles.serviceIcon}>{item.icon}</View>
                  <Text className={styles.serviceName}>{item.name}</Text>
                  {item.requireAuth && isGuest && (
                    <Text className={styles.lockTag}>需登录</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View className={styles.empty}>当前小区暂未配置服务</View>
      )}
    </View>
  );
};

export default ServicesPage;
