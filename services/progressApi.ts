export interface UserProgress {
  userId?: string;
  completedLessons?: string[];
  completedLessonIds?: string[];
  wordsLearned?: number;
  bestQuizScore?: number | null;
  latestQuizScore?: number | null;
  updatedAt?: string;
}

const BASE_URL = "https://h6z7h39ew2.execute-api.us-east-2.amazonaws.com";
export const DEFAULT_USER_ID = "default-user";

/**
 * Fetch saved user progress from AWS API Gateway / Lambda / DynamoDB.
 */
export async function getProgress(
  userId: string = DEFAULT_USER_ID
): Promise<UserProgress | null> {
  try {
    const response = await fetch(`${BASE_URL}/progress/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.warn(`[progressApi] GET failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const lessonList: string[] = Array.isArray(data.completedLessons)
      ? data.completedLessons
      : Array.isArray(data.completedLessonIds)
      ? data.completedLessonIds
      : [];

    return {
      userId: data.userId || userId,
      completedLessons: lessonList,
      completedLessonIds: lessonList,
      wordsLearned: typeof data.wordsLearned === "number" ? data.wordsLearned : undefined,
      bestQuizScore: data.bestQuizScore ?? null,
      latestQuizScore: data.latestQuizScore ?? null,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.warn("[progressApi] GET error:", error);
    return null;
  }
}

/**
 * Save user progress to AWS API Gateway / Lambda / DynamoDB.
 */
export async function saveProgress(
  userId: string = DEFAULT_USER_ID,
  progress: Omit<UserProgress, "userId" | "updatedAt">
): Promise<boolean> {
  try {
    const lessonList: string[] = Array.isArray(progress.completedLessons)
      ? progress.completedLessons
      : Array.isArray(progress.completedLessonIds)
      ? progress.completedLessonIds
      : [];

    const payload = {
      userId,
      completedLessons: lessonList,
      completedLessonIds: lessonList,
      wordsLearned: progress.wordsLearned || 0,
      bestQuizScore: progress.bestQuizScore ?? null,
      latestQuizScore: progress.latestQuizScore ?? null,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${BASE_URL}/progress/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(`[progressApi] PUT failed. Status: ${response.status}, Body: ${responseText}`);
      return false;
    }

    const responseText = await response.text().catch(() => "");
    console.log(`[progressApi] PUT succeeded. Status: ${response.status}, Body: ${responseText}`);
    return true;
  } catch (error) {
    console.error("[progressApi] PUT network/fetch error:", error);
    return false;
  }
}
