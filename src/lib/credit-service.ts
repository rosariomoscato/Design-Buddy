import { db } from './db';
import { user, creditUsage } from './schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface CreditUsageResult {
  success: boolean;
  newBalance?: number;
  error?: string;
}

export class CreditService {
  /**
   * Get user's current credit balance
   */
  static async getUserCredits(userId: string): Promise<number> {
    const result = await db.select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    
    return result[0]?.credits || 0;
  }

  /**
   * Use credits for a user
   */
  static async useCredits(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<CreditUsageResult> {
    try {
      // Start a transaction to ensure consistency
      const result = await db.transaction(async (tx) => {
        // Get current balance
        const currentUser = await tx.select({ credits: user.credits })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        if (!currentUser[0]) {
          throw new Error('User not found');
        }

        const currentBalance = currentUser[0].credits;

        // Check if user has enough credits
        if (currentBalance < amount) {
          throw new Error('Insufficient credits');
        }

        // Update user balance
        await tx.update(user)
          .set({ 
            credits: currentBalance - amount,
            updatedAt: new Date()
          })
          .where(eq(user.id, userId));

        // Record credit usage
        await tx.insert(creditUsage).values({
          id: uuidv4(),
          userId,
          creditsUsed: amount,
          description,
          createdAt: new Date(),
        });

        return { success: true, newBalance: currentBalance - amount };
      });

      return result;
    } catch (error) {
      console.error('Credit usage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to use credits'
      };
    }
  }

  /**
   * Add credits to a user's account
   */
  static async addCredits(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<CreditUsageResult> {
    try {
      const result = await db.transaction(async (tx) => {
        // Get current balance
        const currentUser = await tx.select({ credits: user.credits })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        if (!currentUser[0]) {
          throw new Error('User not found');
        }

        const currentBalance = currentUser[0].credits;

        // Update user balance
        await tx.update(user)
          .set({ 
            credits: currentBalance + amount,
            updatedAt: new Date()
          })
          .where(eq(user.id, userId));

        // Record negative credit usage (addition)
        if (amount > 0) {
          await tx.insert(creditUsage).values({
            id: uuidv4(),
            userId,
            creditsUsed: -amount, // Negative to indicate addition
            description,
            createdAt: new Date(),
          });
        }

        return { success: true, newBalance: currentBalance + amount };
      });

      return result;
    } catch (error) {
      console.error('Credit addition error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add credits'
      };
    }
  }

  /**
   * Get credit usage history for a user
   */
  static async getCreditHistory(userId: string, limit: number = 50) {
    return await db.select({
      id: creditUsage.id,
      creditsUsed: creditUsage.creditsUsed,
      description: creditUsage.description,
      createdAt: creditUsage.createdAt,
    })
    .from(creditUsage)
    .where(eq(creditUsage.userId, userId))
    .orderBy(creditUsage.createdAt)
    .limit(limit);
  }

  /**
   * Initialize user with 30 free credits (for new users)
   */
  static async initializeUserCredits(userId: string): Promise<void> {
    try {
      await db.update(user)
        .set({ 
          credits: 30,
          updatedAt: new Date()
        })
        .where(eq(user.id, userId));
    } catch (error) {
      console.error('Error initializing user credits:', error);
      throw error;
    }
  }
}