export const handle = async (promise) => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err.response?.data || { msg: "Something went wrong" };
  }
};