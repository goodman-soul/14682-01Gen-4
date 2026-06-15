import { Notice } from '@/types';

export const notices: Notice[] = [
  {
    id: 'n1',
    communityId: 'c1',
    title: '关于春节期间物业服务时间调整的通知',
    type: 'notice',
    content: '尊敬的业主：春节期间（2月9日-2月17日）物业服务中心工作时间调整为9:00-17:00，24小时报修热线保持畅通。祝大家新春快乐！',
    publishTime: '2026-02-01 09:00',
    isPublic: true
  },
  {
    id: 'n2',
    communityId: 'c1',
    title: '1号楼电梯维护保养通知',
    type: 'warning',
    content: '1号楼电梯将于2月5日上午9:00-12:00进行例行维护保养，请您提前安排出行，给您带来的不便敬请谅解。',
    publishTime: '2026-01-30 14:30',
    isPublic: false,
    buildingScope: ['1号楼']
  },
  {
    id: 'n3',
    communityId: 'c1',
    title: '社区元宵节联欢活动报名',
    type: 'activity',
    content: '元宵节来临之际，物业服务中心将举办"欢乐元宵"主题活动，包括猜灯谜、包汤圆等环节，时间2月14日下午14:00，欢迎业主踊跃报名参加！',
    publishTime: '2026-01-28 10:00',
    isPublic: true
  },
  {
    id: 'n4',
    communityId: 'c2',
    title: '阳光花园春季绿化养护计划',
    type: 'notice',
    content: '为提升小区环境品质，物业服务中心将于3月开展春季绿化养护工作，包括绿植修剪、施肥、病虫害防治等。',
    publishTime: '2026-02-05 08:30',
    isPublic: true
  },
  {
    id: 'n5',
    communityId: 'c2',
    title: '消防设施安全检查通知',
    type: 'warning',
    content: '物业服务中心将于2月10日对小区消防设施进行全面安全检查，请各位业主配合。',
    publishTime: '2026-02-02 15:00',
    isPublic: true
  },
  {
    id: 'n6',
    communityId: 'c3',
    title: '金色港湾业主大会通知',
    type: 'notice',
    content: '经业委会研究决定，定于2026年3月15日下午2点在小区会所召开年度业主大会，讨论本年度物业相关事项，请各位业主准时参加。',
    publishTime: '2026-02-08 09:00',
    isPublic: true
  },
  {
    id: 'n7',
    communityId: 'c3',
    title: '停车位管理系统升级通知',
    type: 'notice',
    content: '为提升停车管理体验，小区智能停车系统将于2月12日凌晨进行系统升级，升级期间临时停车请配合人工登记。',
    publishTime: '2026-02-06 16:00',
    isPublic: true
  },
  {
    id: 'n8',
    communityId: 'c3',
    title: '垃圾分类宣传周活动',
    type: 'activity',
    content: '2月15日-2月21日为小区垃圾分类宣传周，现场设有垃圾分类知识科普和小游戏，参与即可获得精美礼品。',
    publishTime: '2026-02-03 11:00',
    isPublic: true
  },
  {
    id: 'n9',
    communityId: 'c1',
    title: '水费调价通知',
    type: 'notice',
    content: '根据市政部门通知，自3月1日起居民用水价格调整为5.5元/吨，请各位业主知悉。',
    publishTime: '2026-01-25 09:00',
    isPublic: true
  },
  {
    id: 'n10',
    communityId: 'c3',
    title: '5栋外墙清洗作业',
    type: 'warning',
    content: '5栋外墙清洗作业将于2月18日-2月20日进行，请关好门窗，注意安全。',
    publishTime: '2026-02-07 13:00',
    isPublic: false,
    buildingScope: ['5栋']
  }
];

export const getNoticesByCommunity = (communityId: string, isGuest: boolean, building?: string): Notice[] => {
  return notices.filter(n => {
    if (n.communityId !== communityId) return false;
    if (isGuest) return n.isPublic;
    if (!n.isPublic && n.buildingScope && building) {
      return n.buildingScope.includes(building);
    }
    return true;
  });
};
