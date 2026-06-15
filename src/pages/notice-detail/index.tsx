import React, { useMemo, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import { notices } from '@/data/notices';
import { Notice } from '@/types';

const NoticeDetailPage: React.FC = () => {
  const router = useRouter();
  const { currentCommunity, isGuest, currentProperty } = useAppStore();
  const noticeId = router.params.id;
  const [liked, setLiked] = useState(false);

  const notice: Notice | undefined = useMemo(() => {
    if (!noticeId) return notices[0];
    return notices.find(n => n.id === noticeId) || notices[0];
  }, [noticeId]);

  const relatedNotices = useMemo(() => {
    if (!notice || !currentCommunity) return [];
    return notices
      .filter(n => n.communityId === currentCommunity.id && n.id !== notice.id && (isGuest ? n.isPublic : true))
      .slice(0, 3);
  }, [notice, currentCommunity, isGuest]);

  useDidShow(() => {
    console.log('[NoticeDetail] 页面展示', { noticeId: notice?.id, title: notice?.title });
  });

  const getTagStyle = () => {
    if (!notice) return '';
    switch (notice.type) {
      case 'notice': return styles.tagNotice;
      case 'activity': return styles.tagActivity;
      case 'warning': return styles.tagWarning;
      default: return styles.tagNotice;
    }
  };

  const getTagName = () => {
    if (!notice) return '通知';
    switch (notice.type) {
      case 'notice': return '通知';
      case 'activity': return '活动';
      case 'warning': return '提醒';
      default: return '通知';
    }
  };

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  const handleLike = () => {
    setLiked(!liked);
    Taro.showToast({ title: liked ? '已取消' : '已点赞', icon: 'none' });
  };

  const handleFavorite = () => {
    Taro.showToast({ title: '收藏功能开发中', icon: 'none' });
  };

  const handleRelatedClick = (id: string) => {
    Taro.redirectTo({ url: `/pages/notice-detail/index?id=${id}` });
  };

  if (!notice) {
    return (
      <View className={styles.page}>
        <View className={styles.container}>
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>公告不存在或已删除</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerBg}>
        <View className={styles.headerContent}>
          <Text className={styles.headerTitle}>{currentCommunity?.name}</Text>
          <Text className={styles.headerSubtitle}>社区公告详情</Text>
        </View>
      </View>

      <View className={styles.container}>
        <View className={styles.noticeCard}>
          <View className={styles.tagRow}>
            <Text className={classnames(styles.tag, getTagStyle())}>{getTagName()}</Text>
            {notice.buildingScope && notice.buildingScope.length > 0 && (
              <Text className={classnames(styles.tag, styles.scopeTag)}>
                {notice.buildingScope.join('、')} 可见
              </Text>
            )}
            {notice.isPublic && (
              <Text className={classnames(styles.tag, styles.scopeTag)}>全体业主可见</Text>
            )}
          </View>

          <Text className={styles.title}>{notice.title}</Text>

          <View className={styles.metaRow}>
            <View className={styles.metaLeft}>
              <View className={styles.publisherAvatar}>🏢</View>
              <View className={styles.publisherInfo}>
                <Text className={styles.publisherInfo.publisherName}>物业服务中心</Text>
                <Text className={styles.publisherInfo.publishTime}>{notice.publishTime}</Text>
              </View>
            </View>
            <View className={styles.readCount}>
              👁️ {Math.floor(Math.random() * 500) + 100} 阅读
            </View>
          </View>

          <View className={styles.content}>
            {notice.content.split('。').filter(p => p.trim()).map((para, idx) => (
              <p key={idx}>{para.trim()}。</p>
            ))}
          </View>
        </View>

        {relatedNotices.length > 0 && (
          <View className={styles.relatedSection}>
            <Text className={styles.sectionTitle}>相关公告</Text>
            {relatedNotices.map(n => (
              <View
                key={n.id}
                className={styles.relatedCard}
                onClick={() => handleRelatedClick(n.id)}
              >
                <Text className={styles.relatedTitle}>{n.title}</Text>
                <Text className={styles.relatedTime}>{n.publishTime}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className={styles.footerBar}>
        <View className={styles.actionItem} onClick={handleLike}>
          <Text className={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          <Text className={styles.actionText}>{liked ? '已赞' : '点赞'}</Text>
        </View>
        <View className={styles.actionItem} onClick={handleFavorite}>
          <Text className={styles.actionIcon}>⭐</Text>
          <Text className={styles.actionText}>收藏</Text>
        </View>
        <View className={styles.actionItem} onClick={handleShare}>
          <Text className={styles.actionIcon}>📤</Text>
          <Text className={styles.actionText}>分享</Text>
        </View>
        <View
          className={styles.actionItem}
          onClick={() => {
            if (currentCommunity?.propertyPhone) {
              Taro.makePhoneCall({ phoneNumber: currentCommunity.propertyPhone });
            }
          }}
        >
          <Text className={styles.actionIcon}>📞</Text>
          <Text className={styles.actionText}>联系物业</Text>
        </View>
      </View>
    </View>
  );
};

export default NoticeDetailPage;
