export const getAllUsers = async ({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const params = new URLSearchParams({
      _page: page.toString(),
      _limit: limit.toString(),
      _sort: sortBy || "",
      _order: sortOrder || "",
    });

    if (status) {
      params.append("status", status);
    }

    if (search) {
      params.append("q", search); // ✅ correct search param
    }
    const response = await fetch(
      `http://localhost:5000/users?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const total = response.headers.get("X-Total-Count");

    return { data: await response.json(), total: Number(total) };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const getUserById = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to  fetch user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const createUser = async (userData: {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "none";
}) => {
  try {
    const response = await fetch(`http://localhost:5000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const updateUser = async (userData: {
  userData: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive" | "none";
  };
}) => {
  try {
    const response = await fetch(
      `http://localhost:5000/users/${userData.userData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData.userData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
