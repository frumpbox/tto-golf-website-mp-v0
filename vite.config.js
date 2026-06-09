import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        leaderboard: 'leaderboard.html',
        courseRatings: 'course-ratings.html',
        shop: 'shop.html',
        yearInReview: 'year-in-review.html'
      }
    }
  }
});
