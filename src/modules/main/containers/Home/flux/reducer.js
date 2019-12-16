import * as HomeActionTypes from './constants';

const initialState = {
  feedItems: [],
  socialItems: {
    items: [],
    offset: null,
  },
  contacted: {
    date: null,
    items: [],
  },
  contactedLast30Days: [],
  nps: null,
  notifications: [],
  npsComments: [],
  trendingThemes: null,
};

const actionsMap = {
  [HomeActionTypes.ADD_FEED_ITEMS](state, action) {
    return {
      ...state, feedItems: [...action.feedItems, ...state.feedItems],
    };
  },
  [HomeActionTypes.ADD_SOCIAL_ITEMS](state, action) {
    return {
      ...state, socialItems: { items: [...state.socialItems.items, ...action.socialItems], offset: action.offset },
    };
  },
  [HomeActionTypes.REMOVE_FEED_ITEMS](state) {
    return {
      ...state, feedItems: [],
    };
  },
  [HomeActionTypes.ADD_NPS_COMMENTS](state, action) {
    return {
      ...state, npsComments: [...state.npsComments, ...action.npsComments],
    };
  },
  [HomeActionTypes.REMOVE_NPS_COMMENTS](state) {
    return {
      ...state, npsComments: [],
    };
  },
  [HomeActionTypes.REMOVE_NPS_COMMENT](state, action) {
    return {
      ...state, npsComments: state.npsComments.filter((npsComment) => npsComment.id !== action.comment.id),
    };
  },

  [HomeActionTypes.CLEAR_HOME_FEED](state) {
    return { ...state, feedItems: [] };
  },

  // @athmangude says => @ronnienyaga I don't understand this logic
  [HomeActionTypes.CLEAR_NPS_CATEGORY_COMMENTS](state, action) {
    return {
      ...state,
      npsComments: state.npsComments.filter((npsComment) => {
        const { category } = action;
        if (category === 'promoters') {
          return npsComment.npsScore < 8;
        }

        if (category === 'passives') {
          return npsComment.npsScore > 8 || npsComment.npsScore < 7;
        }

        if (category === 'detractors') {
          return npsComment.npsScore > 6;
        }
      }),
    };
  },
  [HomeActionTypes.ADD_CONTACTED](state, action) {
    return {
      ...state, contacted: action.contacted,
    };
  },
  [HomeActionTypes.ADD_CONTACTED_LAST_30_DAYS](state, action) {
    return {
      ...state, contactedLast30Days: action.contacted,
    };
  },
  [HomeActionTypes.REMOVE_CONTACTED](state) {
    return {
      ...state, contacted: { date: null, items: [] },
    };
  },
  [HomeActionTypes.SET_NPS](state, action) {
    return {
      ...state, nps: action.nps,
    };
  },
  [HomeActionTypes.SET_TRENDING_THEMES](state, action) {
    return {
      ...state, trendingThemes: action.themes,
    };
  },
  [HomeActionTypes.UNSET_SET_NPS](state) {
    return {
      ...state, nps: null,
    };
  },
  [HomeActionTypes.CLEAR_FEED](state) {
    return {
      ...state,
      feedItems: [],
      contacted: {
        date: null,
        items: [],
      },
      nps: null,
      npsComments: [],
    };
  },
  [HomeActionTypes.ADD_NOTIFICATIONS](state, action) {
    return {
      ...state, notifications: action.notifications,
    };
  },
  [HomeActionTypes.ADD_NOTIFICATION](state, action) {
    return {
      ...state, notifications: [...state.notifications, action.notification],
    };
  },
  [HomeActionTypes.REMOVE_NOTIFICATIONS](state) {
    return {
      ...state, notifications: [],
    };
  },
};

export default function home(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
