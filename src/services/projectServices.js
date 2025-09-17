import axios from "../setup/axios";

const fetchProjectsByGroup = (groupId, page = 1, limit = 5) => {
  const params = {
    page,
    limit,
  };

  if (groupId) {
    params.groupId = groupId;
  }

  return axios.get("/api/v1/project/read", { params });
};

export { fetchProjectsByGroup };
