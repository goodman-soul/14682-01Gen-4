import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/app';
import { getBillsByProperty } from '@/data/payments';
import { PaymentBill } from '@/types';

type TabType = 'all' | 'unpaid' | 'paid';

const BILL_TYPE_INFO: Record<string, { name: string; icon: string; iconClass: string }> = {
  property: { name: '物业管理费', icon: '🏢', iconClass: styles.iconProperty },
  water: { name: '水费', icon: '💧', iconClass: styles.iconWater },
  electricity: { name: '电费', icon: '⚡', iconClass: styles.iconElectricity },
  gas: { name: '燃气费', icon: '🔥', iconClass: styles.iconGas }
};

const PaymentDetailPage: React.FC = () => {
  const { isGuest, currentProperty, currentCommunity, login } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('unpaid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const bills: PaymentBill[] = useMemo(() => {
    if (!currentProperty) return [];
    return getBillsByProperty(currentProperty.id);
  }, [currentProperty]);

  const filteredBills = useMemo(() => {
    if (activeTab === 'all') return bills;
    if (activeTab === 'unpaid') return bills.filter(b => b.status === 'unpaid');
    return bills.filter(b => b.status === 'paid');
  }, [bills, activeTab]);

  const unpaidBills = useMemo(() => bills.filter(b => b.status === 'unpaid'), [bills]);
  const paidBills = useMemo(() => bills.filter(b => b.status === 'paid'), [bills]);
  const unpaidTotal = useMemo(() => unpaidBills.reduce((sum, b) => sum + b.amount, 0), [unpaidBills]);

  const selectedUnpaid = useMemo(() => unpaidBills.filter(b => selectedIds.has(b.id)), [unpaidBills, selectedIds]);
  const selectedTotal = useMemo(() => selectedUnpaid.reduce((sum, b) => sum + b.amount, 0), [selectedUnpaid]);
  const allUnpaidSelected = unpaidBills.length > 0 && unpaidBills.every(b => selectedIds.has(b.id));

  useDidShow(() => {
    console.log('[Payment] 页面展示', {
      property: currentProperty?.room,
      unpaidCount: unpaidBills.length,
      unpaidTotal
    });
  });

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const toggleSelectAll = () => {
    if (allUnpaidSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unpaidBills.map(b => b.id)));
    }
  };

  const toggleSelect = (billId: string) => {
    const next = new Set(selectedIds);
    if (next.has(billId)) {
      next.delete(billId);
    } else {
      next.add(billId);
    }
    setSelectedIds(next);
  };

  const handlePaySingle = (bill: PaymentBill) => {
    Taro.showModal({
      title: '确认缴费',
      content: `您即将支付 ${BILL_TYPE_INFO[bill.type].name} ${bill.period}，金额 ¥${bill.amount.toFixed(2)}`,
      confirmText: '立即支付',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '支付中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '支付成功', icon: 'success' });
            console.log('[Payment] 单笔支付成功', { billId: bill.id, amount: bill.amount });
          }, 1000);
        }
      }
    });
  };

  const handlePayAll = () => {
    if (selectedUnpaid.length === 0) {
      Taro.showToast({ title: '请选择要支付的账单', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认缴费',
      content: `您即将支付 ${selectedUnpaid.length} 笔账单，合计 ¥${selectedTotal.toFixed(2)}`,
      confirmText: '立即支付',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '支付中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '支付成功', icon: 'success' });
            setSelectedIds(new Set());
            console.log('[Payment] 合并支付成功', { count: selectedUnpaid.length, total: selectedTotal });
          }, 1200);
        }
      }
    });
  };

  const isDeadlineNear = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return diff < 7 * 24 * 60 * 60 * 1000 && diff > 0;
  };

  if (isGuest) {
    return (
      <View className={styles.page}>
        <View className={styles.headerCard}>
          <View className={styles.locationRow}>
            <Text style={{ fontSize: '28rpx', opacity: 0.9 }}>缴费中心</Text>
          </View>
          <View className={styles.amountSection}>
            <Text className={styles.amountLabel}>待缴金额</Text>
            <Text className={styles.amountValue}>--<Text className={styles.amountUnit}>元</Text></Text>
          </View>
        </View>
        <View className={styles.container}>
          <View className={styles.guestCard}>
            <Text className={styles.guestIcon}>💰</Text>
            <Text className={styles.guestText}>登录后可查看和缴纳物业费用</Text>
            <Button className={styles.loginBtn} onClick={handleLogin}>立即登录</Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.locationRow}>
          <View className={styles.locationLeft}>
            <Text className={styles.locationCommunity}>{currentCommunity?.name}</Text>
            <Text className={styles.locationRoom}>
              {currentProperty?.building} · {currentProperty?.room}
            </Text>
          </View>
          <Text style={{ fontSize: '24rpx' }}>切换 ›</Text>
        </View>
        <View className={styles.amountSection}>
          <Text className={styles.amountLabel}>待缴金额（元）</Text>
          <Text className={styles.amountValue}>
            {unpaidTotal.toFixed(2)}
          </Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{unpaidBills.length}</Text>
            <Text className={styles.statLabel}>待缴笔数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{paidBills.length}</Text>
            <Text className={styles.statLabel}>已缴笔数</Text>
          </View>
        </View>
      </View>

      <View className={styles.container}>
        <View className={styles.tabs}>
          <View
            className={classnames(styles.tab, activeTab === 'all' && styles.tabActive)}
            onClick={() => setActiveTab('all')}
          >
            全部
          </View>
          <View
            className={classnames(styles.tab, activeTab === 'unpaid' && styles.tabActive)}
            onClick={() => setActiveTab('unpaid')}
          >
            待缴
            {unpaidBills.length > 0 && <View className={styles.tabBadge}>{unpaidBills.length}</View>}
          </View>
          <View
            className={classnames(styles.tab, activeTab === 'paid' && styles.tabActive)}
            onClick={() => setActiveTab('paid')}
          >
            已缴
          </View>
        </View>

        {filteredBills.length > 0 ? (
          <View className={styles.billList}>
            {filteredBills.map((bill) => {
              const typeInfo = BILL_TYPE_INFO[bill.type];
              const isSelected = selectedIds.has(bill.id);
              return (
                <View key={bill.id} className={styles.billCard}>
                  <View className={styles.billHeader}>
                    <View className={styles.billType}>
                      <View className={classnames(styles.billIcon, typeInfo.iconClass)}>
                        {typeInfo.icon}
                      </View>
                      <View>
                        <Text className={styles.billTypeName}>{typeInfo.name}</Text>
                        <Text className={styles.billPeriod}>{bill.period}</Text>
                      </View>
                    </View>
                    <View className={styles.billAmount}>
                      <Text className={styles.amountNum}>
                        <Text className={styles.amountPrefix}>¥</Text>
                        {bill.amount.toFixed(2)}
                      </Text>
                      <Text
                        className={classnames(
                          styles.billStatus,
                          bill.status === 'unpaid' ? styles.statusUnpaid : styles.statusPaid
                        )}
                      >
                        {bill.status === 'unpaid' ? '待缴费' : '已缴费'}
                      </Text>
                    </View>
                  </View>
                  <View className={styles.billFooter}>
                    {bill.status === 'unpaid' ? (
                      <>
                        <View
                          className={classnames(styles.checkRow)}
                          onClick={() => toggleSelect(bill.id)}
                        >
                          <View
                            className={classnames(styles.checkBox, isSelected && styles.checkBoxActive)}
                          >
                            {isSelected && '✓'}
                          </View>
                          <Text
                            className={classnames(styles.deadline, isDeadlineNear(bill.deadline) && styles.deadlineWarn)}
                          >
                            截止日期：{bill.deadline}
                            {isDeadlineNear(bill.deadline) && ' · 即将到期'}
                          </Text>
                        </View>
                        <Button className={styles.payBtn} onClick={() => handlePaySingle(bill)}>
                          立即缴费
                        </Button>
                      </>
                    ) : (
                      <Text className={styles.deadline}>缴费完成 · 感谢您的配合</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🎉</Text>
            {activeTab === 'unpaid' ? '暂无待缴账单' : activeTab === 'paid' ? '暂无已缴账单' : '暂无账单'}
          </View>
        )}
      </View>

      {activeTab !== 'paid' && unpaidBills.length > 0 && (
        <View className={styles.footerBar}>
          <View className={styles.footerLeft}>
            <View className={styles.checkRow} onClick={toggleSelectAll}>
              <View className={classnames(styles.checkBox, allUnpaidSelected && styles.checkBoxActive)}>
                {allUnpaidSelected && '✓'}
              </View>
              <Text className={styles.checkLabel}>全选待缴账单</Text>
            </View>
            <View className={styles.totalRow}>
              合计：<Text className={styles.totalAmount}>¥{selectedTotal.toFixed(2)}</Text>
            </View>
          </View>
          <Button className={styles.payAllBtn} onClick={handlePayAll}>
            合并支付{selectedUnpaid.length > 0 ? `(${selectedUnpaid.length})` : ''}
          </Button>
        </View>
      )}
    </View>
  );
};

export default PaymentDetailPage;
