import { Prisma } from '@prisma/client';

export type ContinentWithCountries = Prisma.ContinentGetPayload<{
  include: { countries: true };
}>;

export type ContinentWithPosts = Prisma.ContinentGetPayload<{
  include: { articles: { include: { user: true } } };
}>;

export type ArticleWithUser = Prisma.ArticleGetPayload<{
  include: { user: true };
}>;

export type CategoryWithCountries = Prisma.CategoryGetPayload<{
  include: { countries: true };
}>;

export type TourWithSchedules = Prisma.TourGetPayload<{
  include: { schedules: true };
}>;

export type TourWithDestination = Prisma.TourGetPayload<{
  include: { destination: true };
}>;

export type UserWithAccount = Prisma.UserGetPayload<{
  include: { accounts: true };
}>;

export type BookingWithTour = Prisma.BookingGetPayload<{
  include: { tour: true };
}>;

export type ReviewWithUserAndTour = Prisma.ReviewGetPayload<{
  include: { user: true; tour: true };
}>;
