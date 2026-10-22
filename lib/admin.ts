import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
    isPlatformAdminEmail,
    PLATFORM_ADMIN_EMAIL,
} from "@/lib/platform-admin";

const adminIds = [
    "user_2tkC1z5zJJ4Sw2b85JXWEqmNeuY",
]

// Admin emails for additional verification
const adminEmails = ["22521285@gm.uit.edu.vn", PLATFORM_ADMIN_EMAIL];

export const getIsAdmin = async () => {
    try {
        const { userId } = await auth();
        console.log(`🔍 Admin check - User ID: ${userId}`);

        if (!userId) {
            console.log("❌ No user ID found");
            return false;
        }

        // Check by user ID first
        if (adminIds.indexOf(userId) !== -1) {
            console.log(`✅ Admin access granted to ${userId} (by ID)`);
            return true;
        }

        if (await getUserRole(userId) === "ADMIN") {
            console.log(`✅ Admin access granted to ${userId} (by database role)`);
            return true;
        }

        try {
            const user = await currentUser();
            const userEmail =
                user?.emailAddresses.find(
                    (address) => address.id === user.primaryEmailAddressId
                )?.emailAddress ?? user?.primaryEmailAddress?.emailAddress;

            if (
                userEmail &&
                (isPlatformAdminEmail(userEmail) ||
                    adminEmails.includes(userEmail.toLowerCase()))
            ) {
                console.log(`✅ Admin access granted to ${userEmail} (by email)`);
                return true;
            }
        } catch (error) {
            console.error("Error checking admin by email:", error);
        }

        console.log(`❌ Admin access denied for ${userId}`);
        return false;
    } catch (error) {
        console.error("Error in getIsAdmin:", error);
        return false;
    }
}

/**
 * Get user role from database
 * @param userId - Clerk user ID
 * @returns User role (STUDENT, TEACHER, ADMIN) or null if not found
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.userId, userId),
        });

        if (!user) {
            console.log(`❌ User not found: ${userId}`);
            return null;
        }

        console.log(`✅ User role for ${userId}: ${user.role}`);
        return user.role;
    } catch (error) {
        console.error("Error in getUserRole:", error);
        return null;
    }
}