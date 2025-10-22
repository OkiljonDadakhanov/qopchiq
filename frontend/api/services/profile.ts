import authClient from "@/api/authClient";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile";

// ✅ Professional error handling for profile services
const handleProfileError = (error: any) => {
  console.error("Profile service error:", error);
  throw new Error(error.message || "Profile operation failed");
};

export const fetchUserProfile = async (options?: {
  signal?: AbortSignal;
}): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get("/api/users/me", {
      signal: options?.signal,
    });
    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;

    if (!payload) {
      throw new Error("No profile data received");
    }

    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
      phone: payload.phoneNumber || payload.phone,
      avatar: payload.avatar || null,
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };

    // ✅ Debug: Log date information

    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

// ✅ Fetch updated profile after avatar update
export const fetchUpdatedProfile = async (options?: {
  signal?: AbortSignal;
}): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get("/api/users/me", {
      signal: options?.signal,
    });

    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;

    if (!payload) {
      throw new Error("No updated profile data received");
    }

    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
      phone: payload.phoneNumber || payload.phone,
      avatar: payload.avatar || null,
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payload.createdAt || "",
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };

    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

// ✅ Universal profile update with text fields and avatar file
export const updateUserProfile = async (
  payload: UpdateProfileData,
  avatarFile?: File
): Promise<UserProfile> => {
  try {
    // Create FormData for universal API
    const formData = new FormData();

    // Add text fields
    if (payload.name) formData.append("name", payload.name);
    if (payload.email) formData.append("email", payload.email);
    if (payload.phone) formData.append("phone", payload.phone);

    // Add avatar file if provided
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const { data } = await authClient.patch("/api/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payloadData = data?.user ?? data;

    if (!payloadData) {
      throw new Error("No updated profile data received");
    }

    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payloadData,
      phone: payloadData.phoneNumber || payloadData.phone,
      avatar: payloadData.avatar || null,
      createdAt: payloadData.createdAt || "",
      updatedAt: payloadData.updatedAt || "",
      lastLogin: payloadData.lastLogin || "",
    };

    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

export const changeUserPassword = async (
  payload: ChangePasswordData
): Promise<void> => {
  try {
    const { data } = await authClient.post("/api/change-password", payload);
    return data as void;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    const { data } = await authClient.delete("/api/users/me");
    return data as void;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

// ✅ Update phone number specifically (convenience method)
export const updatePhone = async (phone: string): Promise<UserProfile> => {
  return updateUserProfile({ phone }, undefined);
};

export default {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
};
