import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';

interface DoorDevice {
  id: string;
  name: string;
  icon: string;
  status: 'online' | 'offline';
}

const DOORS_MAP: Record<string, DoorDevice[]> = {
  c1: [
    { id: 'd1', name: '小区正门', icon: '🏛️', status: 'online' },
    { id: 'd2', name: '1号楼单元门', icon: '🚪', status: 'online' },
    { id: 'd3', name: '地下车库入口', icon: '🚗', status: 'online' },
    { id: 'd4', name: '小区侧门', icon: '🚧', status: 'offline' }
  ],
  c2: [
    { id: 'd1', name: '小区大门', icon: '🏛️', status: 'online' },
    { id: 'd2', name: 'A座单元门', icon: '🚪', status: 'online' },
    { id: 'd3', name: '车库入口', icon: '🚗', status: 'online' }
  ],
  c3: [
    { id: 'd1', name: '小区正门', icon: '🏛️', status: 'online' },
    { id: 'd2', name: '5栋单元门', icon: '🚪', status: 'online' },
    { id: 'd3', name: '地下车库A区', icon: '🚗', status: 'online' },
    { id: 'd4', name: '地下车库B区', icon: '🚗', status: 'online' },
    { id: 'd5', name: '小区北门', icon: '🏛️', status: 'online' },
    { id: 'd6', name: '会所大门', icon: '🏠', status: 'offline' }
  ]
};

const HISTORY = [
  { door: '1号楼单元门', time: '2026-02-10 08:15', type: '本人开锁' },
  { door: '小区正门', time: '2026-02-09 18:32', type: '本人开锁' },
  { door: '地下车库入口', time: '2026-02-09 07:45', type: '本人开锁' },
  { door: '1号楼单元门', time: '2026-02-08 20:10', type: '访客开锁' }
];

const AccessUnlockPage: React.FC = () => {
  const { isGuest, currentCommunity, currentProperty, login } = useAppStore();
  const [activeDoor, setActiveDoor] = useState<string>('d1');
  const [unlockStatus, setUnlockStatus] = useState<'idle' | 'unlocking' | 'success'>('idle');
  const [visitorCode, setVisitorCode] = useState<string | null>(null);

  const doors = useMemo(() => {
    if (!currentCommunity) return [];
    return DOORS_MAP[currentCommunity.id] || DOORS_MAP['c1'];
  }, [currentCommunity]);

  const currentDoor = useMemo(() => {
    return doors.find(d => d.id === activeDoor) || doors[0];
  }, [doors, activeDoor]);

  useDidShow(() => {
    console.log('[Access] 页面展示', { community: currentCommunity?.name, doors: doors.length });
  });

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const handleUnlock = () => {
    if (!currentDoor || currentDoor.status === 'offline') {
      Taro.showToast({ title: '设备离线，请联系物业', icon: 'none' });
      return;
    }
    setUnlockStatus('unlocking');
    Taro.vibrateShort({ type: 'medium' });
    console.log('[Access] 开始开锁', { door: currentDoor.name });

    setTimeout(() => {
      setUnlockStatus('success');
      Taro.vibrateShort({ type: 'light' });
      setTimeout(() => {
        setUnlockStatus('idle');
      }, 2000);
    }, 1500);
  };

  const handleSelectDoor = (door: DoorDevice) => {
    if (door.status === 'offline') {
      Taro.showToast({ title: '设备离线', icon: 'none' });
      return;
    }
    setActiveDoor(door.id);
    setUnlockStatus('idle');
  };

  const handleGenerateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVisitorCode(code);
    Taro.showToast({ title: '已生成访客验证码', icon: 'success' });
    console.log('[Access] 生成访客验证码', { code });
  };

  const handleCopyCode = () => {
    if (visitorCode) {
      Taro.setClipboardData({
        data: visitorCode,
        success: () => Taro.showToast({ title: '已复制', icon: 'success' })
      });
    }
  };

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  if (isGuest) {
    return (
      <View className={styles.page}>
        <View className={styles.guestCard}>
          <Text className={styles.guestIcon}>🚪</Text>
          <Text className={styles.guestText}>登录后可使用门禁开锁和访客邀请</Text>
          <Button className={styles.loginBtn} onClick={handleLogin}>立即登录</Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.locationBar}>
        <View>
          <Text className={styles.locationCommunity}>{currentCommunity?.name}</Text>
          <Text className={styles.locationRoom}>
            {currentProperty?.building} · {currentProperty?.room}
          </Text>
        </View>
        <Text style={{ fontSize: '24rpx', color: '#86909C' }}>蓝牙已连接</Text>
      </View>

      <View className={styles.unlockSection}>
        <Text className={styles.sectionHint}>请将手机靠近门禁设备</Text>
        <View className={styles.unlockBtnWrap}>
          <View className={styles.pulseRing} />
          <View className={styles.pulseRing} />
          <View className={styles.pulseRing} />
          <Button
            className={styles.unlockBtn}
            onClick={handleUnlock}
            disabled={unlockStatus === 'unlocking'}
          >
            <Text className={styles.unlockIcon}>
              {unlockStatus === 'success' ? '✅' : currentDoor?.icon || '🔓'}
            </Text>
            <Text className={styles.unlockText}>
              {unlockStatus === 'unlocking' ? '开锁中...' : unlockStatus === 'success' ? '已开锁' : '点击开锁'}
            </Text>
            <Text className={styles.unlockSubtext}>{currentDoor?.name}</Text>
          </Button>
        </View>
        <Text
          className={classnames(
            styles.unlockStatus,
            unlockStatus === 'success' && styles.statusSuccess
          )}
        >
          {unlockStatus === 'success'
            ? '门已开启，请通行'
            : unlockStatus === 'unlocking'
            ? '正在连接设备...'
            : '点击上方按钮远程开锁'}
        </Text>
      </View>

      <View className={styles.doorListSection}>
        <Text className={styles.sectionTitle}>选择门禁</Text>
        <View className={styles.doorGrid}>
          {doors.map(door => (
            <View
              key={door.id}
              className={classnames(styles.doorCard, activeDoor === door.id && styles.doorActive)}
              onClick={() => handleSelectDoor(door)}
            >
              <View className={styles.doorIcon}>{door.icon}</View>
              <Text className={styles.doorName}>{door.name}</Text>
              <Text className={styles.doorStatus}>
                {door.status === 'online' ? '● 在线' : '○ 离线'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.visitorSection}>
        <View className={styles.visitorHeader}>
          <Text className={styles.visitorTitle}>
            👥 访客邀请
          </Text>
          <Text style={{ fontSize: '24rpx', color: '#86909C' }}>30分钟有效</Text>
        </View>
        {visitorCode ? (
          <>
            <View className={styles.visitorCode}>
              <Text className={styles.codeValue}>{visitorCode}</Text>
              <View className={styles.codeActions}>
                <Button className={styles.codeBtn} onClick={handleCopyCode}>复制</Button>
                <Button className={styles.codeBtn} onClick={handleShare}>分享</Button>
              </View>
            </View>
            <Text className={styles.codeExpire}>验证码将在 29:58 后失效</Text>
          </>
        ) : (
          <Button className={styles.generateBtn} onClick={handleGenerateCode}>
            生成访客验证码
          </Button>
        )}
      </View>

      <View className={styles.historySection}>
        <Text className={styles.sectionTitle}>最近开锁记录</Text>
        {HISTORY.map((item, idx) => (
          <View key={idx} className={styles.historyItem}>
            <View className={styles.historyIcon}>🔓</View>
            <View className={styles.historyInfo}>
              <Text className={styles.historyDoor}>{item.door}</Text>
              <Text className={styles.historyTime}>{item.time}</Text>
            </View>
            <Text className={styles.historyType}>{item.type}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AccessUnlockPage;
