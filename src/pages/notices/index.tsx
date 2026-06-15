import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import NoticeCard from '@/components/NoticeCard';
import { getNoticesByCommunity } from '@/data/notices';

type TabType = 'all' | 'notice' | 'activity' | 'warning';

const NoticesPage: React.FC = () => {
  const { currentCommunity, isGuest, currentProperty } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const allNotices = useMemo(() => {
    if (!currentCommunity) return [];
    return getNoticesByCommunity(currentCommunity.id, isGuest, currentProperty?.building);
  }, [currentCommunity, isGuest, currentProperty]);

  const filteredNotices = useMemo(() => {
    if (activeTab === 'all') return allNotices;
    return allNotices.filter(n => n.type === activeTab);
  }, [allNotices, activeTab]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'notice', label: '通知' },
    { key: 'activity', label: '活动' },
    { key: 'warning', label: '提醒' }
  ];

  useDidShow(() => {
    console.log('[Notices] 页面展示', {
      community: currentCommunity?.name,
      total: allNotices.length,
      isGuest
    });
  });

  return (
    <View className={styles.page}>
      <View className={styles.communityBar}>
        <Text className={styles.communityName}>{currentCommunity?.name}</Text>
        <Text className={styles.scopeTip}>
          {isGuest ? '游客模式 · 仅公开公告' : `已显示 ${currentProperty?.building || '全部楼栋'} 范围`}
        </Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {filteredNotices.length > 0 ? (
        <View className={styles.noticeList}>
          {filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </View>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📭</Text>
          暂无相关公告
        </View>
      )}
    </View>
  );
};

export default NoticesPage;
