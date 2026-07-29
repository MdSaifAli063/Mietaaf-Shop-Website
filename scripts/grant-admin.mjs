import { readFileSync } from "node:fs";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const email = process.argv[2]?.trim().toLowerCase();
const serviceAccountPath =
  process.argv[3]?.trim() ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

if (!email) {
  console.error(
    'Usage: npm run admin:grant -- admin@example.com "C:\\secure\\firebase-service-account.json"\n' +
      "Alternatively, set GOOGLE_APPLICATION_CREDENTIALS before running the command.",
  );
  process.exitCode = 1;
} else {
  try {
    const credential = serviceAccountPath
      ? cert(JSON.parse(readFileSync(serviceAccountPath, "utf8")))
      : applicationDefault();
    const app =
      getApps()[0] ??
      initializeApp({
        credential,
      });
    const auth = getAuth(app);
    const user = await auth.getUserByEmail(email);
    const currentClaims = user.customClaims ?? {};

    await auth.setCustomUserClaims(user.uid, {
      ...currentClaims,
      admin: true,
    });

    console.log(
      `Admin access granted to ${email}. Sign out and sign in again, or use Refresh access on /admin.`,
    );
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      console.error(
        `No Firebase Authentication user exists for ${email}.\n\n` +
          "Create this account once through the website /signup page, or run the command " +
          "again with the exact email of an existing Firebase Authentication user.",
      );
      process.exitCode = 1;
    } else if (error?.code === "ENOENT") {
      console.error(
        `The service-account file was not found:\n${serviceAccountPath}\n\n` +
          "Pass the correct absolute JSON path as the second argument.",
      );
      process.exitCode = 1;
    } else if (
      error?.code === "app/invalid-credential" ||
      String(error?.message).includes("default credentials")
    ) {
      console.error(
        "Firebase Admin credentials are missing or invalid.\n\n" +
          'Run:\nnpm run admin:grant -- admin@example.com "C:\\secure\\firebase-service-account.json"',
      );
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
