import React, { useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import { repairOrders, getRepairsByProperty } from '@/data/repairs';
import { RepairOrder } from '@/types';

interface TimelineStep {
  title: string;
  time: string;
  desc?: string;
  status: 'done' | 'active' | 'pending';
}

const STATUS_MAP: Record<string, { icon: string; text: string; desc: string }> = {
  pending: { icon: '⏳', text: '待受理', desc: '已提交报修，等待物业受理' },
  processing: { icon: '🔧', text: '维修中', desc: '维修人员正在处理' },
  completed: { icon: '✅', text: '已完成', desc: '维修完成，感谢您的配合' },
  cancelled: { icon: '❌', text: '已取消', desc: '您已取消该报修单' }
};

const RepairDetailPage: React.FC = () => {
  const router = useRouter();
  const { isGuest, currentProperty, currentCommunity, login } = useAppStore();
  const orderId = router.params.id;

  const order: RepairOrder | undefined = useMemo(() => {
    if (!orderId) {
      return currentProperty
        ? getRepairsByProperty(currentProperty.id)[0]
        : repairOrders[0];
    }
    return repairOrders.find(r => r.id === orderId) || repairOrders[0];
  }, [orderId, currentProperty]);

  useDidShow(() => {
    console.log('[RepairDetail] 页面展示', { orderId: order?.id, status: order?.status });
  });

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const timeline: TimelineStep[] = useMemo(() => {
    if (!order) return [];
    const base: TimelineStep[] = [
      {
        title: '已提交报修',
        time: order.createTime,
        desc: '您已成功提交报修申请',
        status: 'done'
      },
      {
        title: '物业已受理',
        time: '2026-02-09 11:00',
        desc: '物业管家 李师傅 已接单',
        status: order.status === 'pending' ? 'active' : 'done'
      },
      {
        title: '维修人员上门',
        time: '2026-02-09 14:30',
        desc: '维修工程师 王师傅 已出发',
        status:
          order.status === 'processing'
            ? 'active'
            : order.status === 'completed' || order.status === 'cancelled'
            ? 'done'
            : 'pending'
      },
      {
        title: '维修完成',
        time: '2026-02-09 16:00',
        desc: order.status === 'completed' ? '问题已修复完成' : undefined,
        status: order.status === 'completed' ? 'done' : 'pending'
      }
    ];
    if (order.status === 'cancelled') {
      return base.slice(0, 2);
    }
    return base;
  }, [order]);

  const handleCallWorker = () => {
    Taro.makePhoneCall({ phoneNumber: '13800138000' });
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消此报修单吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消报修', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 800);
        }
      }
    });
  };

  const handleRate = () => {
    Taro.showToast({ title: '评价功能开发中', icon: 'none' });
  };

  if (isGuest) {
    return (
      <View className={styles.page}>
        <View className={styles.guestCard}>
          <Text className={styles.guestIcon}>🔍</Text>
          <Text className={styles.guestText}>登录后可查看报修详情</Text>
          <Button className={styles.loginBtn} onClick={handleLogin}>立即登录</Button>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View className={styles.page}>
        <View className={styles.guestCard}>
          <Text className={styles.guestIcon}>❓</Text>
          <Text className={styles.guestText}>未找到该报修单</Text>
        </View>
      </View>
    );
  }

  const statusInfo = STATUS_MAP[order.status];

  return (
    <View className={styles.page}>
      <View className={styles.statusCard}>
        <Text className={styles.statusIcon}>{statusInfo.icon}</Text>
        <Text className={styles.statusText}>{statusInfo.text}</Text>
        <Text className={styles.statusDesc}>{statusInfo.desc}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>报修信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>报修单号</Text>
          <Text className={styles.infoValue}>#{order.id.toUpperCase()}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>报修类型</Text>
          <Text className={styles.infoValue}>{order.type}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>紧急程度</Text>
          <Text className={styles.infoValue}>
            <Text className={classnames(styles.tag, styles.tagNormal)}>普通报修</Text>
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>报修位置</Text>
          <Text className={styles.infoValue}>{currentCommunity?.name}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>问题描述</Text>
          <Text className={styles.infoValue}>{order.description}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>处理进度</Text>
        <View className={styles.timeline}>
          {timeline.map((step, idx) => (
            <View
              key={idx}
              className={classnames(
                styles.timelineItem,
                step.status === 'active' && styles.timelineItemActive,
                step.status === 'done' && styles.timelineItemDone
              )}
            >
              <View className={styles.timelineContent}>
                <Text className={styles.timelineTitle}>{step.title}</Text>
                <Text className={styles.timelineTime}>{step.time}</Text>
                {step.desc && <Text className={styles.timelineDesc}>{step.desc}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>

      {(order.status === 'processing' || order.status === 'completed') && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>维修人员</Text>
          <View className={styles.workerCard}>
            <View className={styles.workerAvatar}>👷</View>
            <View className={styles.workerInfo}>
              <Text className={styles.workerName}>王工程师</Text>
              <Text className={styles.workerMeta}>金牌维修 · 从业8年 · 好评率98%</Text>
            </View>
            <Button className={styles.callBtn} onClick={handleCallWorker}>
              📞 联系
            </Button>
          </View>
        </View>
      )}

      <View className={styles.footerBar}>
        {order.status === 'pending' && (
          <Button className={styles.btnSecondary} onClick={handleCancel}>取消报修</Button>
        )}
        {order.status === 'completed' && (
          <Button className={styles.btnPrimary} onClick={handleRate}>评价服务</Button>
        )}
        {order.status === 'processing' && (
          <Button className={styles.btnPrimary} onClick={handleCallWorker}>联系维修人员</Button>
        )}
      </View>
    </View>
  );
};

export default RepairDetailPage;
