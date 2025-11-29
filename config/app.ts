export const SCREENS = {
  // Auth flow
  WELCOME: "welcome",
  PHONE_LOGIN: "phone-login",
  PHONE_SIGNUP: "phone-signup",
  OTP_VERIFICATION_LOGIN: "otp-verification-login",
  OTP_VERIFICATION_SIGNUP: "otp-verification-signup",
  FARMER_TYPE_SELECTION: "farmer-type-selection",
  FARM_DETAILS: "farm-details",
  PERMISSIONS: "permissions",

  // Farmer screens
  FARMER_DASHBOARD: "farmer-dashboard",
  QUESTS_LIST: "quests-list",
  COMMUNITY: "community",
  REWARDS: "rewards",
  FARMER_PROFILE: "farmer-profile",
  SETTINGS: "settings",
  IMPACT_TRACKER: "impact-tracker",

  // Quest flow
  QUEST_INTRO: "quest-intro",
  QUEST_STEPS: "quest-steps",
  QUEST_SUBMIT_PROOF: "quest-submit-proof",
  QUEST_VERIFICATION: "quest-verification",
  QUEST_REWARD: "quest-reward",
  QUEST_SUMMARY: "quest-summary",

  // Admin screens
  ADMIN_LOGIN: "admin-login",
  ADMIN_DASHBOARD: "admin-dashboard",
  ADMIN_FARMERS: "admin-farmers",
  ADMIN_QUESTS: "admin-quests",
  ADMIN_VERIFICATION: "admin-verification",
  ADMIN_REWARDS: "admin-rewards",
};

export const USER_TYPES = {
  FARMER: "farmer",
  ADMIN: "admin",
};

export const FARMER_TYPES = {
  BEGINNER: "beginner",
  PRO: "pro",
};

export const PERMISSION_TYPES = {
  LOCATION: "location",
  NOTIFICATIONS: "notifications",
  CAMERA: "camera",
};
