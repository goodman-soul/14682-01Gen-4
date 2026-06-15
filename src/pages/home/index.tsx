import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import CommunitySwitcher from '@/components/CommunitySwitcher';
import QuickEntry from '@/components/QuickEntry';
import NoticeCard from '@/components/NoticeCard';
import GuestTip from '@/components/GuestTip';
import { getNoticesByCommunity } from '@/data/notices';

const HomePage: React.FC = () => {
  const { currentCommunity, isGuest, currentProperty, allCommunities } = useAppStore();

  const notices = useMemo(() => {
    if (!currentCommunity) return [];
    return getNoticesByCommunity(currentCommunity.id, isGuest, currentProperty?.building).slice(0, 3);
  }, [currentCommunity, isGuest, currentProperty]);

  useDidShow(() => {
    console.log('[Home] 页面展示', { community: currentCommunity?.name, isGuest });
  });

  return (
    <View className={styles.page}>
      <View className={styles.headerBg}>
        <View className={styles.statusBar} />
        <View className={styles.headerContent}>
          <Text className={styles.title}>智慧物业</Text>
          <Text className={styles.subtitle}>贴心服务，品质生活</Text>
        </View>
      </View>

      <View className={styles.container}>
        <CommunitySwitcher />

        <GuestTip />

        {currentCommunity?.bannerImage && (
          <View className={styles.banner}>
            <Image
              className={styles.bannerImg}
              src={currentCommunity.bannerImage}
              mode="aspectFill"
              onError={(e) => console.error('[Home] Banner图片加载失败', e.detail)}
            />
          </View>
        )}

        {currentCommunity?.quickEntries && currentCommunity.quickEntries.length > 0 && (
          <QuickEntry title="常用功能" entries={currentCommunity.quickEntries} />
        )}

        <View>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最新公告</Text>
            <Text className={styles.moreLink} onClick={() => Taro.switchTab({ url: '/pages/notices/index' })}>
              查看全部 ›
            </Text>
          </View>
          <View className={styles.noticeList}>
            {notices.length > 0 ? (
              notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <Text className={styles.empty}>暂无公告</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
