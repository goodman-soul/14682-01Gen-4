import { RepairOrder } from '@/types';

export const repairOrders: RepairOrder[] = [
  {
    id: 'r1',
    propertyId: 'p1',
    communityId: 'c1',
    title: '客厅灯具损坏',
    description: '客厅主灯不亮，可能是开关或灯泡问题',
    status: 'processing',
    createTime: '2026-02-09 10:30',
    type: '水电维修'
  },
  {
    id: 'r2',
    propertyId: 'p1',
    communityId: 'c1',
    title: '卫生间水龙头漏水',
    description: '卫生间洗手池水龙头滴水，需要检修',
    status: 'completed',
    createTime: '2026-02-05 14:20',
    type: '水电维修'
  },
  {
    id: 'r3',
    propertyId: 'p2',
    communityId: 'c1',
    title: '入户门锁故障',
    description: '智能门锁无法正常识别指纹',
    status: 'pending',
    createTime: '2026-02-10 08:15',
    type: '门窗维修'
  },
  {
    id: 'r4',
    propertyId: 'p3',
    communityId: 'c3',
    title: '空调制冷效果差',
    description: '卧室空调制冷效果不佳，需要清洗或加氟',
    status: 'pending',
    createTime: '2026-02-08 16:45',
    type: '家电维修'
  },
  {
    id: 'r5',
    propertyId: 'p1',
    communityId: 'c1',
    title: '墙面开裂',
    description: '主卧墙面有一条约1米长的裂缝',
    status: 'completed',
    createTime: '2026-01-20 09:00',
    type: '土建维修'
  },
  {
    id: 'r6',
    propertyId: 'p3',
    communityId: 'c3',
    title: '电梯按键失灵',
    description: '5栋电梯3楼按键无反应',
    status: 'processing',
    createTime: '2026-02-09 11:00',
    type: '公共维修'
  },
  {
    id: 'r7',
    propertyId: 'p1',
    communityId: 'c1',
    title: '地暖不热',
    description: '客厅地暖温度不够，可能需要排气',
    status: 'cancelled',
    createTime: '2026-01-15 13:30',
    type: '水电维修'
  }
];

export const getRepairsByProperty = (propertyId: string): RepairOrder[] => {
  return repairOrders.filter(r => r.propertyId === propertyId);
};
