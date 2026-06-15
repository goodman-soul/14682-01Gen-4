import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Notice } from '@/types';

interface NoticeCardProps {
  notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const getTagStyle = () => {
    switch (notice.type) {
      case 'notice': return styles.tagNotice;
      case 'activity': return styles.tagActivity;
      case 'warning': return styles.tagWarning;
      default: return styles.tagNotice;
    }
  };

  const getTagName = () => {
    switch (notice.type) {
      case 'notice': return '通知';
      case 'activity': return '活动';
      case 'warning': return '提醒';
      default: return '通知';
    }
  };

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/notice-detail/index?id=${notice.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={classnames(styles.tag, getTagStyle())}>{getTagName()}</Text>
        <Text className={styles.time}>{notice.publishTime}</Text>
      </View>
      <Text className={styles.title}>{notice.title}</Text>
      <Text className={styles.content}>{notice.content}</Text>
    </View>
  );
};

export default NoticeCard;
