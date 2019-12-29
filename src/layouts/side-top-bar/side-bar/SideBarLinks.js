export default [{
  app: 'surveys',
  label: 'Surveys',
  icon: 'smartphone',
  paths: ['/', '/surveys'],
  showActivityLog: true,
  sublinks: [{
    label: 'Home',
    path: '/',
    level: 0,
  }, {
    label: 'Surveys',
    path: '/surveys',
    level: 0,
  }],
}, {
  app: 'live-chat',
  label: 'Live Chat',
  icon: 'sms',
  paths: ['/live-chat', '/live-chat/:activeParticipantConversationId?'],
  showActivityLog: false,
}, {
  app: 'analytics',
  label: 'Analytics',
  icon: 'show_chart',
  paths: ['/analytics'],
  showActivityLog: false,
  sublinks: [{
    label: 'Customers',
    path: '/analytics/customers',
    level: 0,
    sublinks: [{
      label: 'All Customers',
      path: '/analytics/customers',
      level: 1,
    }, {
      label: 'Customers',
      path: '/analytics/customers',
      level: 1,
    }, {
      label: 'Customers',
      path: '/analytics/customers',
      level: 1,
    }, {
      label: 'Customers',
      path: '/analytics/customers',
      level: 1,
    }, {
      label: 'Customers',
      path: '/analytics/customers',
      level: 1,
    }],
  }, {
    label: 'Loyalty & Satisfaction',
    path: '/analytics/loyalty-satisfaction',
    level: 0,
    sublinks: [{
      icon: 'loyalty',
      label: 'Customers',
      path: '/analytics/loyalty-satisfaction',
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
      path: '/analytics/behaviour',
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
      path: '/analytics/spend',
      level: 1,
    }],
  }, {
    icon: 'map',
    label: 'Demographics',
    path: '/analytics/demographic',
    level: 0,
  }],
}, {
  app: 'settings',
  label: 'Settings',
  icon: 'settings',
  paths: ['/settings'],
  showActivityLog: false,
  sublinks: [{
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }, {
    label: 'Item',
    path: '/settings/item',
    level: 0,
  }],
}];
