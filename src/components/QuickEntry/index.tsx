import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import { QuickEntry as QuickEntryType } from '@/types';

interface QuickEntryProps {
  title?: string;
  entries: QuickEntryType[];
}

const QuickEntry: React.FC<QuickEntryProps> = ({ title = '常用功能', entries }) => {
  const { isGuest } = useAppStore();

  const handleClick = (entry: QuickEntryType) => {
    if (entry.requireAuth && isGuest) {
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
    Taro.navigateTo({ url: entry.pagePath });
  };

  return (
    <View className={styles.card}>
      <Text className={styles.cardTitle}>{title}</Text>
      <View className={styles.grid}>
        {entries.map((entry) => (
          <View
            key={entry.id}
            className={classnames(styles.item, entry.requireAuth && isGuest && styles.disabled)}
            onClick={() => handleClick(entry)}
          >
            <View className={styles.iconWrap}>{entry.icon}</View>
            <Text className={styles.itemName}>{entry.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QuickEntry;
