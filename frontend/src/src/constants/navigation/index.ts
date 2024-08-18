export const NAVIGATION_LIST = {
  top: '/',
  auth: {
    signUp: '/auth/sign_up',
    signIn: '/auth/sign_in',
  },
  readingRecords: {
    list: '/reading_records',
    new: '/reading_records/new',
    edit: '/reading_records/edit/:id',
  },
};

export const NAVIGATION_PAGE = {
  top: '/',
  auth: {
    signUp: '/auth/sign_up',
    signIn: '/auth/sign_in',
  },
  readingRecords: {
    list: '/reading_records',
    new: '/reading_records/new',
    edit: '/reading_records/edit',
  },
};

export const NOT_NEEDS_SIGNED_IN_PAGE = [
  NAVIGATION_PAGE.top,
  NAVIGATION_PAGE.auth.signUp,
  NAVIGATION_PAGE.auth.signIn,
];
