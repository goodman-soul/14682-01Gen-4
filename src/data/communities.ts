import { Community, Property, UserInfo } from '@/types';

export const communities: Community[] = [
  {
    id: 'c1',
    name: '翡翠华府',
    address: '海淀区中关村大街 188 号',
    propertyPhone: '400-800-1234',
    buildings: ['1号楼', '2号楼', '3号楼', '5号楼', '6号楼'],
    bannerImage: 'https://picsum.photos/id/1039/750/400',
    quickEntries: [
      { id: 'q1', name: '报修', icon: '🔧', pagePath: '/pages/repair-submit/index', requireAuth: true },
      { id: 'q2', name: '缴费', icon: '💰', pagePath: '/pages/payment-detail/index', requireAuth: true },
      { id: 'q3', name: '门禁', icon: '🚪', pagePath: '/pages/access-unlock/index', requireAuth: true },
      { id: 'q4', name: '公告', icon: '📢', pagePath: '/pages/notices/index', requireAuth: false }
    ],
    serviceMenu: [
      { id: 's1', name: '物业报修', icon: '🔧', pagePath: '/pages/repair-submit/index', category: 'property', requireAuth: true },
      { id: 's2', name: '缴费中心', icon: '💰', pagePath: '/pages/payment-detail/index', category: 'property', requireAuth: true },
      { id: 's3', name: '门禁开锁', icon: '🚪', pagePath: '/pages/access-unlock/index', category: 'travel', requireAuth: true },
      { id: 's4', name: '访客邀请', icon: '👥', pagePath: '/pages/access-unlock/index', category: 'travel', requireAuth: true },
      { id: 's5', name: '家政服务', icon: '🧹', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's6', name: '快递代收', icon: '📦', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's7', name: '家电维修', icon: '📺', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's8', name: '社区公告', icon: '📢', pagePath: '/pages/notices/index', category: 'property', requireAuth: false }
    ]
  },
  {
    id: 'c2',
    name: '阳光花园',
    address: '朝阳区望京西路 56 号',
    propertyPhone: '400-800-5678',
    buildings: ['A座', 'B座', 'C座', 'D座'],
    bannerImage: 'https://picsum.photos/id/1044/750/400',
    quickEntries: [
      { id: 'q1', name: '报修', icon: '🔧', pagePath: '/pages/repair-submit/index', requireAuth: true },
      { id: 'q2', name: '缴费', icon: '💰', pagePath: '/pages/payment-detail/index', requireAuth: true },
      { id: 'q3', name: '公告', icon: '📢', pagePath: '/pages/notices/index', requireAuth: false }
    ],
    serviceMenu: [
      { id: 's1', name: '物业报修', icon: '🔧', pagePath: '/pages/repair-submit/index', category: 'property', requireAuth: true },
      { id: 's2', name: '缴费中心', icon: '💰', pagePath: '/pages/payment-detail/index', category: 'property', requireAuth: true },
      { id: 's3', name: '门禁开锁', icon: '🚪', pagePath: '/pages/access-unlock/index', category: 'travel', requireAuth: true },
      { id: 's4', name: '家政服务', icon: '🧹', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's5', name: '社区公告', icon: '📢', pagePath: '/pages/notices/index', category: 'property', requireAuth: false }
    ]
  },
  {
    id: 'c3',
    name: '金色港湾',
    address: '东城区建国门内大街 99 号',
    propertyPhone: '400-900-2233',
    buildings: ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋'],
    bannerImage: 'https://picsum.photos/id/1018/750/400',
    quickEntries: [
      { id: 'q1', name: '报修', icon: '🔧', pagePath: '/pages/repair-submit/index', requireAuth: true },
      { id: 'q2', name: '缴费', icon: '💰', pagePath: '/pages/payment-detail/index', requireAuth: true },
      { id: 'q3', name: '门禁', icon: '🚪', pagePath: '/pages/access-unlock/index', requireAuth: true },
      { id: 'q4', name: '公告', icon: '📢', pagePath: '/pages/notices/index', requireAuth: false },
      { id: 'q5', name: '家政', icon: '🧹', pagePath: '/pages/services/index', requireAuth: true }
    ],
    serviceMenu: [
      { id: 's1', name: '物业报修', icon: '🔧', pagePath: '/pages/repair-submit/index', category: 'property', requireAuth: true },
      { id: 's2', name: '缴费中心', icon: '💰', pagePath: '/pages/payment-detail/index', category: 'property', requireAuth: true },
      { id: 's3', name: '门禁开锁', icon: '🚪', pagePath: '/pages/access-unlock/index', category: 'travel', requireAuth: true },
      { id: 's4', name: '访客邀请', icon: '👥', pagePath: '/pages/access-unlock/index', category: 'travel', requireAuth: true },
      { id: 's5', name: '家政服务', icon: '🧹', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's6', name: '快递代收', icon: '📦', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's7', name: '家电维修', icon: '📺', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's8', name: '管道疏通', icon: '🚰', pagePath: '/pages/services/index', category: 'life', requireAuth: true },
      { id: 's9', name: '社区活动', icon: '🎉', pagePath: '/pages/notices/index', category: 'property', requireAuth: false },
      { id: 's10', name: '社区公告', icon: '📢', pagePath: '/pages/notices/index', category: 'property', requireAuth: false }
    ]
  }
];

export const mockProperties: Property[] = [
  {
    id: 'p1',
    communityId: 'c1',
    communityName: '翡翠华府',
    building: '1号楼',
    room: '1203室',
    owner: '张先生',
    isDefault: true
  },
  {
    id: 'p2',
    communityId: 'c1',
    communityName: '翡翠华府',
    building: '3号楼',
    room: '801室',
    owner: '张先生',
    isDefault: false
  },
  {
    id: 'p3',
    communityId: 'c3',
    communityName: '金色港湾',
    building: '5栋',
    room: '2202室',
    owner: '张先生',
    isDefault: false
  }
];

export const mockUserInfo: UserInfo = {
  id: 'u1',
  name: '张先生',
  phone: '138****8888',
  avatar: 'https://picsum.photos/id/64/200/200',
  isGuest: false,
  properties: mockProperties
};

export const getCommunityById = (id: string): Community | undefined => {
  return communities.find(c => c.id === id);
};
