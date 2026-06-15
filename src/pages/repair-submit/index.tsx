import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

interface RepairType {
  id: string;
  name: string;
  icon: string;
}

const REPAIR_TYPES: RepairType[] = [
  { id: 'water', name: '水电维修', icon: '💧' },
  { id: 'appliance', name: '家电维修', icon: '📺' },
  { id: 'structure', name: '土建维修', icon: '🧱' },
  { id: 'door', name: '门窗维修', icon: '🚪' },
  { id: 'public', name: '公共设施', icon: '🏢' },
  { id: 'other', name: '其他问题', icon: '❓' }
];

const TIME_OPTIONS = ['尽快上门', '工作日上午', '工作日下午', '周末上午', '周末下午'];

const RepairSubmitPage: React.FC = () => {
  const { isGuest, currentCommunity, currentProperty, userInfo, login } = useAppStore();
  const [repairType, setRepairType] = useState<string>('water');
  const [description, setDescription] = useState<string>('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [timeIndex, setTimeIndex] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useDidShow(() => {
    console.log('[RepairSubmit] 页面展示', { community: currentCommunity?.name, isGuest });
  });

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Taro.showToast({ title: '请描述报修问题', icon: 'none' });
      return;
    }
    if (description.trim().length < 5) {
      Taro.showToast({ title: '问题描述至少5个字', icon: 'none' });
      return;
    }

    setSubmitting(true);
    console.log('[RepairSubmit] 提交报修', {
      type: repairType,
      description,
      urgency,
      time: TIME_OPTIONS[timeIndex],
      property: currentProperty?.id
    });

    setTimeout(() => {
      setSubmitting(false);
      Taro.showModal({
        title: '提交成功',
        content: `报修单已提交，物业将${TIME_OPTIONS[timeIndex]}安排维修人员上门，请注意保持电话畅通。`,
        showCancel: false,
        confirmText: '我知道了',
        success: () => {
          Taro.navigateBack();
        }
      });
    }, 1000);
  };

  if (isGuest) {
    return (
      <View className={styles.page}>
        <View className={styles.guestCard}>
          <Text className={styles.guestIcon}>🔧</Text>
          <Text className={styles.guestText}>登录后可提交物业报修申请</Text>
          <Button className={styles.loginBtn} onClick={handleLogin}>立即登录</Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.locationBar}>
        <View className={styles.locationLeft}>
          <Text className={styles.locationIcon}>📍</Text>
          <View className={styles.locationText}>
            <Text className={styles.locationCommunity}>{currentCommunity?.name}</Text>
            <Text className={styles.locationRoom}>
              {currentProperty?.building} · {currentProperty?.room}
            </Text>
          </View>
        </View>
        <Text style={{ color: '#1E9E8F', fontSize: '24rpx' }}>切换 ›</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>报修类型</Text>
        <View className={styles.typeGrid}>
          {REPAIR_TYPES.map((item) => (
            <View
              key={item.id}
              className={classnames(styles.typeItem, repairType === item.id && styles.typeItemActive)}
              onClick={() => setRepairType(item.id)}
            >
              <View className={styles.typeIcon}>{item.icon}</View>
              <Text className={styles.typeText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>问题描述</Text>
        <View className={styles.textareaWrap}>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述遇到的问题，方便维修人员提前准备..."
            placeholderStyle="color: #86909C"
            value={description}
            onInput={(e) => setDescription(e.detail.value.slice(0, 200))}
            maxlength={200}
            autoHeight
          />
          <Text className={styles.textareaCount}>{description.length}/200</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>紧急程度</Text>
        <View className={styles.urgencyRow}>
          <View
            className={classnames(styles.urgencyItem, urgency === 'normal' && styles.urgencyItemActive)}
            onClick={() => setUrgency('normal')}
          >
            <Text className={styles.urgencyIcon}>🔵</Text>
            <Text className={classnames(styles.urgencyText, styles.urgencyTextNormal)}>普通报修</Text>
            <Text style={{ fontSize: '20rpx', color: '#86909C' }}>24小时内响应</Text>
          </View>
          <View
            className={classnames(styles.urgencyItem, urgency === 'urgent' && styles.urgencyItemActive)}
            onClick={() => setUrgency('urgent')}
          >
            <Text className={styles.urgencyIcon}>🚨</Text>
            <Text className={classnames(styles.urgencyText, styles.urgencyTextUrgent)}>紧急报修</Text>
            <Text style={{ fontSize: '20rpx', color: '#86909C' }}>2小时内响应</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>上门时间</Text>
        <Picker
          mode="selector"
          range={TIME_OPTIONS}
          value={timeIndex}
          onChange={(e) => setTimeIndex(Number(e.detail.value))}
        >
          <View className={styles.timeRow}>
            <Text className={styles.timeLabel}>期望上门时间</Text>
            <Text className={styles.timeValue}>
              {TIME_OPTIONS[timeIndex]} ›
            </Text>
          </View>
        </Picker>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>联系信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系人</Text>
          <Text className={styles.infoValue}>{userInfo?.name}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{userInfo?.phone}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>服务热线</Text>
          <Text className={styles.infoValue}>{currentCommunity?.propertyPhone}</Text>
        </View>
      </View>

      <View className={styles.footerBar}>
        <Button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '提交中...' : '提交报修'}
        </Button>
      </View>
    </View>
  );
};

export default RepairSubmitPage;
