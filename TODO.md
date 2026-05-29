# TODO — Phase 7: Daily Challenge Engine Foundation

- [ ] Update `prisma/schema.prisma` with `DailyChallenge`, `DailyQuestion`, `DailyAttempt`, and add `User.dailyAttempts` relation.
- [ ] Run `npx prisma db push` to sync DB.
- [x] Create `app/daily-challenges/page.tsx` (list page).
- [x] Create `app/daily-challenges/[challengeId]/page.tsx` (dynamic detail page).
- [x] Create `app/admin/create-daily-challenge/page.tsx` (admin UI).
- [x] Create `app/api/admin/create-daily-challenge/route.ts` (admin POST API).
- [ ] Run `npm run dev` and manually verify: create Day 1 -> appears in /daily-challenges -> detail page renders questions.
