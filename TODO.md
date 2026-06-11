# TODO — Phase 7: Daily Challenge Engine Foundation

- [ ] Update `prisma/schema.prisma` with `DailyChallenge`, `DailyQuestion`, `DailyAttempt`, and add `User.dailyAttempts` relation.
- [ ] Run `npx prisma db push` to sync DB.
- [x] Create `app/daily-challenges/page.tsx` (list page).
- [x] Create `app/daily-challenges/[challengeId]/page.tsx` (dynamic detail page).
- [x] Create `app/admin/create-daily-challenge/page.tsx` (admin UI).
- [x] Create `app/api/admin/create-daily-challenge/route.ts` (admin POST API).
- [ ] Run `npm run dev` and manually verify: create Day 1 -> appears in /daily-challenges -> detail page renders questions.

1: all the data of the student including the usn, phone number, academic data, email, birth date, branch, college, permanent/correspondance address, area pin code at the time of registration

2: omni id's should be provided after the registration

3: table wise diverstification of the contents in the table where admin can see the list of participants.
4: profile page with descriptive bio data, skill profile, and activity profile, achievement progile(hackathon/ideathon if participated, and academic achievemetns), description on the achievements. 


