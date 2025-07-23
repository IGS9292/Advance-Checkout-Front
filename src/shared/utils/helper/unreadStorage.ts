const UNREAD_KEY = "chat_unread_counts";

export const loadUnreadCounts = (): { [userId: string]: number } => {
  try {
    const raw = localStorage.getItem(UNREAD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load unread counts:", e);
    return {};
  }
};

export const saveUnreadCounts = (counts: { [userId: string]: number }) => {
  try {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error("Failed to save unread counts:", e);
  }
};

export const clearUnreadCountForUser = (userId: string) => {
  const counts = loadUnreadCounts();
  delete counts[userId];
  saveUnreadCounts(counts);
  return counts;
};
