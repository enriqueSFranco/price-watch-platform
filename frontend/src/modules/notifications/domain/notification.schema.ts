import { z } from 'zod';

enum NotificationRule {
	Threshold = 'threshold',
	Percentage_Drop = 'percentage_drop',
	Lowest_Price = 'lowest_price',
}

export const NotificationRuleSchema = z.object({
	id: z.string(),
	productId: z.uuidv4(),
	type: NotificationRule,
	value: z.number().nullable(),
	targetEmail: z.email().nullable(),
	isActive: z.boolean(),
	lastNotifiedAt: z.number().nullable(),
	createdAt: z.number(),
});

export type NotificationRuleIn = z.input<typeof NotificationRuleSchema>;
export type NotificationRuleOut = z.output<typeof NotificationRuleSchema>;
