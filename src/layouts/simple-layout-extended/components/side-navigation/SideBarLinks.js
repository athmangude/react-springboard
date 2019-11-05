export default [{
  app: 'home',
  label: 'Home',
  icon: 'home',
  paths: ['/'],
  showRightDrawer: true,
  fullWidthMenu: true,
}, {
  app: 'surveys',
  label: 'Surveys',
  icon: 'smartphone',
  paths: ['/surveys'],
  showRightDrawer: true,
  fullWidthMenu: true,
},
// {
//   app: 'live-chat',
//   label: 'Live Chat',
//   icon: 'sms',
//   paths: ['/live-chat', '/live-chat/:activeParticipantConversationId?'],
//   showRightDrawer: false,
//   fullWidthMenu: false,
// },
{
  app: 'customers',
  label: 'Customers',
  icon: 'group',
  paths: ['/customers'],
  showRightDrawer: false,
  fullWidthMenu: true,
  // sublinks: [{
  //   label: 'All Customers',
  //   path: '/customers/list',
  //   level: 0,
  // }, {
  //   label: 'Segments',
  //   path: '/customers/segments',
  //   level: 0,
  // }],
}, {
  app: 'analytics',
  label: 'Analytics',
  icon: 'show_chart',
  paths: ['/analytics'],
  showRightDrawer: false,
  fullWidthMenu: true,
  sublinks: [{
    label: 'Loyalty & Satisfaction',
    path: '/analytics/loyalty-satisfaction',
    level: 0,
    sublinks: [{
      icon: 'view_stream',
      label: 'Customers',
      path: '/customers',
      level: 1,
    }],
  }, {
    icon: 'whatshot',
    label: 'Behavior',
    path: '/analytics/behaviour',
    level: 0,
    sublinks: [{
      icon: 'view_stream',
      label: 'Customers',
      path: '/customers',
      level: 1,
    }],
  }, {
    icon: 'show_chart',
    label: 'Spend',
    path: '/analytics/spend',
    level: 0,
    sublinks: [{
      icon: 'view_stream',
      label: 'Customers',
      path: '/customers',
      level: 1,
    }],
  }, {
    icon: 'map',
    label: 'Demographics',
    path: '/analytics/demographic',
    level: 0,
  }],
},
{
  app: 'settings',
  label: 'Settings',
  icon: 'settings',
  paths: ['/settings'],
  showRightDrawer: false,
  fullWidthMenu: true,
  sublinks: [{
    label: 'Account',
    path: '/settings/account',
    level: 0,
  }, {
    label: 'Audiences',
    path: '/settings/audiences',
    level: 0,
  }, {
    label: 'Collaborators',
    path: '/settings/collaborators',
    level: 0,
  }, {
    label: 'Profile',
    path: '/settings/me',
    level: 0,
  }, {
    label: 'Touch Points',
    path: '/settings/touch-points',
    level: 0,
  }, {
    label: 'Incentives Usage',
    path: '/settings/incentives-usage',
    level: 0,
  }, {
    label: 'Web Hooks',
    path: '/settings/web-hook-events',
    level: 0,
  }, {
    label: 'Reminders',
    path: '/settings/reminders',
    level: 0,
  }, {
    label: 'Reinvites',
    path: '/settings/reinvites',
    level: 0,
  }, {
    label: 'Delays',
    path: '/settings/delays',
    level: 0,
  }, {
    label: 'Subscriptions',
    path: '/settings/subscriptions',
    level: 0,
  }, {
    label: 'Business Numbers',
    path: '/settings/business-numbers',
    level: 0,
  }, {
    label: 'Payments',
    path: '/settings/payments',
    level: 0,
  }, {
    label: 'DND',
    path: '/settings/dnd-lists',
    level: 0,
  }],
},
];
