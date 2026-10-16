import { DomainError } from '../errors.js';

export interface CustomerReview {
  readonly id: string;
  readonly vehicleId: string;
  readonly bookingReference: string;
  readonly customerName: string;
  readonly customerCity: string;
  readonly overallRating: number; // 1 to 5
  readonly cleanlinessRating: number; // 1 to 5
  readonly conditionRating: number; // 1 to 5
  readonly handoverRating: number; // 1 to 5
  readonly comment: string;
  readonly createdAt: Date;
}

export interface ReviewSummary {
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly cleanlinessAvg: number;
  readonly conditionAvg: number;
  readonly handoverAvg: number;
  readonly reviews: readonly CustomerReview[];
}

export function validateCustomerReview(
  input: Omit<CustomerReview, 'id' | 'createdAt'>,
): void {
  if (
    input.overallRating < 1 ||
    input.overallRating > 5 ||
    !Number.isInteger(input.overallRating)
  ) {
    throw new DomainError('INVALID_INPUT', 'Overall rating must be an integer between 1 and 5');
  }

  if (
    input.cleanlinessRating < 1 ||
    input.cleanlinessRating > 5 ||
    input.conditionRating < 1 ||
    input.conditionRating > 5 ||
    input.handoverRating < 1 ||
    input.handoverRating > 5
  ) {
    throw new DomainError('INVALID_INPUT', 'Category ratings must be between 1 and 5');
  }

  if (!input.comment || input.comment.trim().length < 5) {
    throw new DomainError('INVALID_INPUT', 'Review comment must be at least 5 characters');
  }
}

export function calculateReviewSummary(
  reviews: readonly CustomerReview[],
): ReviewSummary {
  if (reviews.length === 0) {
    return {
      ratingAvg: 5.0,
      ratingCount: 0,
      cleanlinessAvg: 5.0,
      conditionAvg: 5.0,
      handoverAvg: 5.0,
      reviews: [],
    };
  }

  const count = reviews.length;
  const sumOverall = reviews.reduce((sum, r) => sum + r.overallRating, 0);
  const sumCleanliness = reviews.reduce((sum, r) => sum + r.cleanlinessRating, 0);
  const sumCondition = reviews.reduce((sum, r) => sum + r.conditionRating, 0);
  const sumHandover = reviews.reduce((sum, r) => sum + r.handoverRating, 0);

  const round1 = (val: number) => Math.round((val / count) * 10) / 10;

  return {
    ratingAvg: round1(sumOverall),
    ratingCount: count,
    cleanlinessAvg: round1(sumCleanliness),
    conditionAvg: round1(sumCondition),
    handoverAvg: round1(sumHandover),
    reviews,
  };
}
