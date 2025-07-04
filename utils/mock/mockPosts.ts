const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/seed/item${i + 1}/400/400`,
  title: `상품 ${i + 1}`,
  price: (((i + 1) * 1000) % 100000) + 1000,
  region: ["신림동", "구로동", "대림동", "가산동"][i % 4],
  category: ["의류", "디지털 기기", "가구/인테리어", "생활/주방", "유아동"][
    i % 5
  ],
  liked: i % 3 === 0,
  time: `${i + 1}분전`,
}));
export default mockPosts;
